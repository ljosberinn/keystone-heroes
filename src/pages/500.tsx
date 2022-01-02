import Link from "next/link";

import { concern } from "../web/styles/bears";

export default function FiveHundred(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center w-full px-16 py-8 m-auto xl:px-64 xl:py-32 lg:flex-row max-w-screen-2xl">
      <img
        src={concern}
        height="256"
        width="256"
        alt="An error occured! Or something."
        loading="lazy"
      />
      <div className="pt-8 lg:pl-24 lg:pt-0">
        <h1 className="font-semibold ">500</h1>
        <p className="pt-8">
          Something kinda went wrong while trying to show you what we got.
        </p>
        <Link href="/">
          <a className="underline">
            That's not good. Luckily we've been informed about the error. Let's
            go back to square one!
          </a>
        </Link>
      </div>
    </div>
  );
}
