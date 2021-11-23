import { useRouter } from "next/router";
import { useEffect } from "react";

import type {
  ReportHandlerErrorType,
  FightHandlerErrorType,
} from "../../api/utils/errors";
import { warning } from "../icons";
import { widthConstraint } from "../styles/tokens";

type GenericErrorProps =
  | {
      type: "missing-percent";
      percent: number;
    }
  | {
      type: "loading-failed";
      error: ReportHandlerErrorType | FightHandlerErrorType;
    };

function MissingPercentWarning({ percent }: { percent: number }) {
  return (
    <>
      <span className="font-semibold">
        This fight is incomplete - only{" "}
        <span className="underline">{percent.toFixed(2)}%</span> of trash could
        be detected. This could have many reasons, for example:
      </span>{" "}
      <br />
      - the logging player died, released and trash was killed while the player
      was running back and thus out of range to record
      <br />
      - the log is broken due to the game not sending the events
      <br />
      <br />
      Please proceed with this in mind.
    </>
  );
}

function LoadingFailed({
  error,
}: {
  error: ReportHandlerErrorType | FightHandlerErrorType;
}) {
  const { asPath, push } = useRouter();
  const [, reportID, fightID] = asPath.split("/").slice(1);

  useEffect(() => {
    if (error === "UNKNOWN_REPORT" && reportID && fightID) {
      // eslint-disable-next-line no-void
      void push({
        pathname: "/report/[reportID]",
        query: {
          reportID,
          fightID: fightID ? fightID : undefined,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, fightID, reportID]);

  switch (error) {
    case "UNKNOWN_REPORT": {
      return null;
    }

    default: {
      return (
        <>
          <p className="font-semibold">
            Something went horribly wrong here and we're sorry.
          </p>
          <p>At this point, this lousy error message is all we have:</p>
          <p className="py-4 italic">{error}</p>
          <p>
            Please attach a link to the current URL should you file an issue on
            GitHub or Discord. Thanks!
          </p>
        </>
      );
    }
  }
}

// eslint-disable-next-line import/no-default-export
export default function GenericError(
  props: GenericErrorProps
): JSX.Element | null {
  return (
    <div className={`${widthConstraint} text-white pb-4`}>
      <div className="flex flex-col p-2 bg-red-500 rounded-lg md:flex-row">
        <div className="flex justify-center">
          <svg>
            <use href={`#${warning.id}`} />
          </svg>
        </div>
        <div className="p-4">
          {props.type === "missing-percent" ? (
            <MissingPercentWarning percent={props.percent} />
          ) : props.type === "loading-failed" ? (
            <LoadingFailed error={props.error} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
