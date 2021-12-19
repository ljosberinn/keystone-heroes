import { bgPrimary, widthConstraint } from "../../styles/tokens";
import { Pulls } from "./Pulls";

export function Data(): JSX.Element {
  return (
    <section className={`${widthConstraint} pb-6`}>
      <div className="shadow-sm">
        <div className={`px-4 rounded-t-lg pb-2 pt-4 ${bgPrimary}`}>
          <h2 className="text-2xl font-bold">Pull Details</h2>
        </div>

        <Pulls />
      </div>
    </section>
  );
}
