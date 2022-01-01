import { buymeacoffee, patreon, discord, paypal } from "../icons";
import { internalLinkClasses } from "../styles/tokens";
import { buyMeACoffeeUrl, patreonUrl, paypalUrl, discordUrl } from "../urls";
import { ColorModeToggle } from "./ColorModeToggle";
import { ExternalLink } from "./ExternalLink";
import { Logo } from "./Logo";

export function Header(): JSX.Element {
  return (
    <header className="flex items-center justify-between h-20 p-6 border-b border-stone-200 dark:border-gray-700 print:hidden dark:text-stone-100 drop-shadow-sm">
      <nav className="flex items-center justify-between w-full mx-auto space-x-4 max-w-screen-2xl">
        <ul>
          <li>
            <Logo />
          </li>
        </ul>
        <ul className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
          <HeaderNavLink href={buyMeACoffeeUrl} icon={buymeacoffee} />
          <HeaderNavLink href={patreonUrl} icon={patreon} />
          <HeaderNavLink href={paypalUrl} icon={paypal} />
          <HeaderNavLink href={discordUrl} icon={discord} />
          <li>
            <ColorModeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}

type HeaderNavLinkProps = {
  href: string;
  icon: typeof buymeacoffee | typeof patreon | typeof discord | typeof paypal;
};

function HeaderNavLink({ href, icon }: HeaderNavLinkProps) {
  return (
    <li className="py-1 text-base leading-relaxed md:text-sm">
      <ExternalLink className={internalLinkClasses} href={href}>
        <span className="md:items-center md:justify-end md:flex">
          <svg className="inline w-6 h-6 mr-2">
            <use href={`#${icon.id}`} />
          </svg>
        </span>
      </ExternalLink>
    </li>
  );
}
