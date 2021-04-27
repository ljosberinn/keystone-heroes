import { BUILD_TIME, COMMIT_SHA } from "../../constants";
import { ExternalLink } from "./ExternalLink";

export function Footer(): JSX.Element {
  return (
    <footer className="text-sm pt-8 pb-8">
      <nav>
        {COMMIT_SHA && (
          <ExternalLink
            href={`https://github.com/ljosberinn/wcl-to-mdt/tree/${COMMIT_SHA}`}
          >
            Commit {COMMIT_SHA} built at {BUILD_TIME}
          </ExternalLink>
        )}
      </nav>
    </footer>
  );
}
