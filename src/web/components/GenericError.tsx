import { warning } from "../icons";
import { widthConstraint } from "../styles/tokens";

type GenericErrorProps =
  | {
      type: "missing-percent";
      percent: number;
    }
  | {
      type: "loading-failed";
      error: string;
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
          ) : null}
        </div>
      </div>
    </div>
  );
}
