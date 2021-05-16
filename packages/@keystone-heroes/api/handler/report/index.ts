import { ReportRepo } from "@keystone-heroes/db/repos";
import { MIN_KEYSTONE_LEVEL } from "@keystone-heroes/env";
import { wcl } from "@keystone-heroes/wcl/queries";
import { maybeOngoingReport } from "@keystone-heroes/wcl/utils";
import nc from "next-connect";

import { createValidReportIdMiddleware } from "../../middleware/validReportId";
import { NO_CONTENT } from "../../utils/statusCodes";
import { RequestHandler } from "../../utils/types";

type Request = {
  query: {
    id: string;
  };
};

export type ReportResponse = {
  id: string;
  region: string;
  endTime: number;
  startTime: number;
  title: string;
  fights: number[];
};

const reportHandler: RequestHandler<Request, ReportResponse> = async (
  req,
  res
) => {
  const { id } = req.query;
  const report = await ReportRepo.load(id);

  if (report) {
    if (!maybeOngoingReport(report.endTime)) {
      // eslint-disable-next-line no-console
      console.info("[api/report] known & finished report");
      const { id: dbId, region, ...rest } = report;

      //   setCacheControl(res, CacheControl.ONE_MONTH);

      res.json({
        ...rest,
        id,
        region: region.slug,
      });
      return;
    }

    const rawReport = await wcl.report(id);

    if (!rawReport) {
      // eslint-disable-next-line no-console
      console.info(
        "[api/report] known report - failed to load report from WCL"
      );

      const { id: dbId, region, ...rest } = report;

      //   setCacheControl(res, CacheControl.ONE_HOUR);

      res.json({
        ...rest,
        id,
        region: region.slug,
      });
      return;
    }

    await ReportRepo.upsert(id, rawReport);

    res.json({
      id,
      endTime: rawReport.endTime,
      startTime: rawReport.startTime,
      title: rawReport.title,
      region: rawReport.region.slug,
      fights: rawReport.fights
        .filter(
          (fight) =>
            fight.keystoneBonus > 0 && fight.keystoneLevel >= MIN_KEYSTONE_LEVEL
        )
        .map((fight) => fight.id),
    });
    return;
  }

  const rawReport = await wcl.report(id);

  if (!rawReport) {
    // eslint-disable-next-line no-console
    console.info(
      "[api/report] unknown report - failed to load report from WCL"
    );

    res.status(NO_CONTENT).end();
    return;
  }

  await ReportRepo.upsert(id, rawReport);

  //   setCacheControl(
  //     res,
  //     maybeOngoingReport(rawReport.endTime)
  //       ? CacheControl.ONE_HOUR
  //       : CacheControl.ONE_MONTH
  //   );

  res.json({
    id,
    endTime: rawReport.endTime,
    startTime: rawReport.startTime,
    title: rawReport.title,
    region: rawReport.region.slug,
    fights: rawReport.fights
      .filter(
        (fight) =>
          fight.keystoneBonus > 0 && fight.keystoneLevel >= MIN_KEYSTONE_LEVEL
      )
      .map((fight) => fight.id),
  });
};

export const handler = nc()
  .get(createValidReportIdMiddleware("id"))
  .use(reportHandler);
