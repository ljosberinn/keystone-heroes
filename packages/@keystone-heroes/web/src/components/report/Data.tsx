import { bgPrimary } from "../../styles/tokens";
import { Pulls } from "./Pulls";

export function Data(): JSX.Element {
  return (
    <section className="pt-4 lg:pt-8">
      <div className="shadow-sm">
        <div className={`px-4 rounded-t-lg pt-4 sm:p-4 ${bgPrimary}`}>
          <h2 className="text-2xl font-bold">
            <a href="#pull-details" className="hover:underline">
              # Pull Details
            </a>
          </h2>
        </div>

        <Pulls />
      </div>
    </section>
  );
}
