export const isValidReportId = (id?: string | string[]): id is string =>
  !Array.isArray(id) && id?.length === 16 && !id.includes(".");

export const ONGOING_REPORT_THRESHOLD = 18 * 60 * 60 * 1000;

/**
 * assume a report may still be ongoing if its less than one day old
 */
export const maybeOngoingReport = (endTime: number): boolean =>
  ONGOING_REPORT_THRESHOLD > Date.now() - endTime;
