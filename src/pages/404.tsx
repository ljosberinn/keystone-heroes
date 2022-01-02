import Link from "next/link";

import { concern } from "../web/styles/bears";

export default function FourOhFour(): JSX.Element {
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
        <h1 className="font-semibold ">404</h1>
        <p className="pt-8">You seem to be lost.</p>
        <Link href="/">
          <a className="underline">Let's stop being lost, shall we.</a>
        </Link>
      </div>
    </div>
  );
}
