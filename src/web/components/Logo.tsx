import { useTheme } from "next-themes";
import Link from "next/link";

export function Logo(): JSX.Element {
  const { theme } = useTheme();

  return (
    <Link href="/">
      <a className="flex flex-row items-center space-x-4">
        <img
          src={theme === "light" ? "/logo-dark-48.png" : "/logo-light-48.png"}
          alt="Logo"
          height="48"
          width="48"
          className="w-12 h-12"
        />

        <span className="inline text-lg font-semibold tracking-tight md:hidden leading-tighter ">
          KSH
        </span>

        <span className="hidden text-lg font-semibold tracking-tight leading-tighter md:inline">
          Keystone Heroes
        </span>
      </a>
    </Link>
  );
}
