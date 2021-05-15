import nc from "next-connect";

import { MIN_KEYSTONE_LEVEL } from "../../constants";
import {
  CacheControl,
  isValidReportId,
  maybeOngoingReport,
  setCacheControl,
} from "../../server/api";
import { ReportRepo } from "../../server/db/report";
import { loadReportFromSource } from "../../server/queries/report";
import { BAD_REQUEST, NO_CONTENT } from "../../utils/statusCodes";

import type { RequestHandler } from "../../server/types";

type Request = {
  query: {
    id?: string | string[];
  };
};

export type Response =
  | undefined
  | {
      id: string;
      region: string;
      startTime: number;
      endTime: number;
      fights: number[];
      title: string;
    };

const reportHandler: RequestHandler<Request, Response> = async (req, res) => {
  if (
    !req.query.id ||
    !isValidReportId(req.query.id) ||
    Array.isArray(req.query.id)
  ) {
    // eslint-disable-next-line no-console
    console.info('[api/report] missing or invalid "query.id"');

    res.status(BAD_REQUEST).end();
    return;
  }

  const { id } = req.query;
  const report = await ReportRepo.load(id);

  if (report) {
    if (!maybeOngoingReport(report.endTime)) {
      // eslint-disable-next-line no-console
      console.info("[api/report] known & finished report");
      const { id: dbId, region, ...rest } = report;

      setCacheControl(res, CacheControl.ONE_MONTH);

      res.json({
        ...rest,
        id,
        region: region.slug,
      });
      return;
    }

    const rawReport = await loadReportFromSource(id);

    if (!rawReport) {
      // eslint-disable-next-line no-console
      console.info(
        "[api/report] known report - failed to load report from WCL"
      );

      const { id: dbId, region, ...rest } = report;

      setCacheControl(res, CacheControl.ONE_HOUR);

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

  const rawReport = await loadReportFromSource(id);

  if (!rawReport) {
    // eslint-disable-next-line no-console
    console.info(
      "[api/report] unknown report - failed to load report from WCL"
    );

    res.status(NO_CONTENT).end();
    return;
  }

  await ReportRepo.upsert(id, rawReport);

  setCacheControl(
    res,
    maybeOngoingReport(rawReport.endTime)
      ? CacheControl.ONE_HOUR
      : CacheControl.ONE_MONTH
  );

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

export default nc().get(reportHandler);
