import { ExternalLink } from "../web/components/ExternalLink";
import { Seo } from "../web/components/Seo";
import { classnames } from "../web/utils/classnames";

export default function Privacy(): JSX.Element {
  return (
    <>
      <Seo title="Privacy" />
      <section aria-labelledby="privacy-heading" className="px-10 py-8">
        <div className="max-w-6xl mx-auto flex">
          <div className="lg:w-5/12 flex justify-evenly flex-col">
            <h1
              id="privacy-heading"
              className="pb-4 text-4xl font-bold sm:block"
            >
              Privacy
            </h1>

            <p className="py-4 space-x-2 text-2xl font-semibold sm:inline-block">
              Keystone Heroes does not:
            </p>
            <ul className="list-disc">
              <li>have any kind of ads. Neither now, nor in the future.</li>
              <li>use cookies.</li>
              <li>
                track you in any considerable manner. The hosting service -{" "}
                <ExternalLink className="underline" href="https://vercel.com">
                  Vercel
                </ExternalLink>
                - like any service of this category I'm aware of, collects
                access metrics, including, but possibly not limited to
                timestamp, IP address, url and browser user agent.
              </li>
            </ul>

            <p className="pb-4 pt-8 space-x-2 text-2xl font-semibold sm:inline-block">
              Keystone Heroes does:
            </p>
            <ul className="list-disc">
              <li>
                collect error reports through{" "}
                <ExternalLink className="underline" href="https://sentry.io">
                  Sentry
                </ExternalLink>
                , both client and server side. These include IP address,
                timestamp, url and possibly the most recent actions taken by the
                user before the error occured. This data is automatically
                deleted after fourteen days and is exclusively used to detect
                and fix bugs.
              </li>
            </ul>
          </div>

          <div className="lg:block  max-h-fit w-7/12 flex justify-between">
            <div className="h-5/6">
              <img
                src="/static/broker.png"
                className={classnames(
                  "lg:animate-[pulse_4s_ease-in-out_infinite] motion-reduce:animate-none",
                  "absolute top-20 right-0 w-60 opacity-20 h-auto",
                  "lg:h-full lg:m-auto lg:skew-y-6 lg:relative lg:inset-auto lg:w-auto"
                )}
                alt="Broker concept art"
                loading="lazy"
              />
            </div>
            <p className="hidden italic h-1/6 lg:flex justify-center items-center">
              Keystone Heroes is not a data broker.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
