import { commonCardClassNames } from "../../../pages/report/[reportID]";
import { patreon, buymeacoffee } from "../../icons";
import { patreonUrl, buyMeACoffeeUrl } from "../../urls";
import { LinkBox, LinkOverlay } from "../LinkBox";

export type SupportCardProps = {
  type: "patreon" | "buyMeACoffee";
};

// eslint-disable-next-line import/no-default-export
export default function SupportCard({ type }: SupportCardProps): JSX.Element {
  const isPatreon = type === "patreon";

  const href = isPatreon ? patreonUrl : buyMeACoffeeUrl;
  const icon = isPatreon ? patreon : buymeacoffee;
  // including random val since it may be rendered multiple times across categories
  const id = `support-id-${
    isPatreon ? "patreon" : "buymeacoffee"
  }-${Math.random()}`;

  return (
    <div className={commonCardClassNames}>
      <LinkBox
        className="relative flex items-center justify-center h-64 text-2xl rounded-md"
        as="section"
        aria-labelledby={id}
      >
        <LinkOverlay
          href={href}
          className="flex flex-col justify-evenly items-center w-full h-full p-2 bg-white rounded-lg md:p-4 dark:bg-gray-900 "
        >
          <h2 id={id} className="font-extrabold text-center px-4">
            Consider supporting the site to keep the lights on {"<3"}
          </h2>
          <svg className="w-20 h-20">
            <use href={`#${icon.id}`} />
          </svg>
        </LinkOverlay>
      </LinkBox>
    </div>
  );
}
