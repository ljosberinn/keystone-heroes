import { COMMIT_SHA } from "../../constants";
import { ExternalLink } from "./ExternalLink";

export function Footer(): JSX.Element {
  return (
    <footer className="text-sm pt-8 pb-8">
      <nav>
        footer nav
        {COMMIT_SHA && (
          <ExternalLink
            href={`https://github.com/ljosberinn/wcl-to-mdt/tree/${COMMIT_SHA}`}
          >
            {COMMIT_SHA}
          </ExternalLink>
        )}
      </nav>
    </footer>
  );
}
