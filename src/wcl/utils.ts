export const isValidReportId = (id?: string | string[]): id is string => {
  if (!id || Array.isArray(id) || id.includes(".")) {
    return false;
  }

  return (id.startsWith("a:") && id.length === 18) || id.length === 16;
};

export const ONGOING_REPORT_THRESHOLD = 18 * 60 * 60 * 1000;

/**
 * assume a report may still be ongoing if its less than 18 hours old
 */
export const maybeOngoingReport = (endTime: number): boolean =>
  ONGOING_REPORT_THRESHOLD > Date.now() - endTime;
