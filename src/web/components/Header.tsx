import Link from "next/link";

import { ColorModeToggle } from "./ColorModeToggle";

export function Header(): JSX.Element {
  return (
    <header className="flex items-center justify-between h-16 p-6 border-b border-gray-200 dark:border-coolgray-700 print:hidden dark:text-gray-100">
      <nav className="flex items-center justify-between w-full mx-auto space-x-4 max-w-screen-2xl">
        <ul>
          <li>
            <Link href="/">
              <a className="flex flex-col items-center space-y-2 text-center md:flex-row md:items-start md:text-left md:space-x-2 md:space-y-0">
                <div className="mt-1 text-lg font-semibold tracking-tight leading-tighter">
                  Keystone Heroes
                </div>
              </a>
            </Link>
          </li>
        </ul>
        <ColorModeToggle />
      </nav>
    </header>
  );
}
