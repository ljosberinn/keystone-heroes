import { ReportRepo } from "@keystone-heroes/db/repos";
import { wcl } from "@keystone-heroes/wcl/src/queries";
import { maybeOngoingReport } from "@keystone-heroes/wcl/utils";
import nc from "next-connect";

import { createValidReportIDMiddleware } from "../../middleware/validReportID";
import { NO_CONTENT } from "../../utils/statusCodes";

import type { RequestHandler } from "../../utils/types";

type Request = {
  query: {
    reportID: string;
  };
};

export type ReportResponse = {
  reportID: string;
  region: string;
  endTime: number;
  startTime: number;
  title: string;
  fights: readonly number[];
};

const reportHandler: RequestHandler<Request, ReportResponse> = async (
  req,
  res
) => {
  const { reportID } = req.query;
  const report = await ReportRepo.load(reportID);

  if (report) {
    if (!maybeOngoingReport(report.endTime)) {
      // eslint-disable-next-line no-console
      console.info("[api/report] known & finished report");
      const { id: dbId, region, ...rest } = report;

      //   setCacheControl(res, CacheControl.ONE_MONTH);

      res.json({
        ...rest,
        reportID,
        region: region.slug,
      });
      return;
    }

    const rawReport = await wcl.report({ reportID });

    if (!rawReport) {
      // eslint-disable-next-line no-console
      console.info(
        "[api/report] known report - failed to load report from WCL"
      );

      const { id: dbId, region, ...rest } = report;

      //   setCacheControl(res, CacheControl.ONE_HOUR);

      res.json({
        ...rest,
        reportID,
        region: region.slug,
      });
      return;
    }

    await ReportRepo.upsert(reportID, rawReport);

    res.json({
      reportID,
      endTime: rawReport.endTime,
      startTime: rawReport.startTime,
      title: rawReport.title,
      region: rawReport.region.slug,
      fights: rawReport.fights,
    });
    return;
  }

  const rawReport = await wcl.report({ reportID });

  if (!rawReport) {
    // eslint-disable-next-line no-console
    console.info(
      "[api/report] unknown report - failed to load report from WCL"
    );

    res.status(NO_CONTENT).end();
    return;
  }

  await ReportRepo.upsert(reportID, rawReport);

  //   setCacheControl(
  //     res,
  //     maybeOngoingReport(rawReport.endTime)
  //       ? CacheControl.ONE_HOUR
  //       : CacheControl.ONE_MONTH
  //   );

  res.json({
    reportID,
    endTime: rawReport.endTime,
    startTime: rawReport.startTime,
    title: rawReport.title,
    region: rawReport.region.slug,
    fights: rawReport.fights,
  });
};

export const handler = nc()
  .get(createValidReportIDMiddleware("reportID"))
  .use(reportHandler);
