import { ColorModeToggle } from "./ColorModeToggle";

export function Header(): JSX.Element {
  return (
    <header className="py-6 print:hidden">
      <nav>
        <ul>
          <li>text</li>
        </ul>
        <ColorModeToggle />
      </nav>
    </header>
  );
}
