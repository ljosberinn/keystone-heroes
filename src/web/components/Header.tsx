import { ColorModeToggle } from "./ColorModeToggle";
import { Logo } from "./Logo";

export function Header(): JSX.Element {
  return (
    <header className="flex items-center justify-between h-20 p-6 border-b border-gray-200 dark:border-coolgray-700 print:hidden dark:text-gray-100">
      <nav className="flex items-center justify-between w-full mx-auto space-x-4 max-w-screen-2xl">
        <ul>
          <li>
            <Logo />
          </li>
        </ul>
        <ColorModeToggle />
      </nav>
    </header>
  );
}