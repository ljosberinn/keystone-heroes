import { useNProgress } from "@tanem/react-nprogress";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

/**
 * gracefully taken from
 * https://github.com/eggheadio/egghead-next/blob/afaf08690f3c44ee2ed11cad51ad034247713ac8/src/components/route-loading-indicator.tsx
 */
export function RouteChangeIndicator(): JSX.Element {
  const [isAnimating, setIsAnimating] = useState(false);

  const { isFinished, progress } = useNProgress({
    isAnimating,
  });

  const { events } = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsAnimating(true);
    };

    const handleRouteChangeEnd = () => {
      setIsAnimating(false);
    };

    events.on("routeChangeStart", handleRouteChangeStart);
    events.on("routeChangeComplete", handleRouteChangeEnd);
    events.on("routeChangeError", handleRouteChangeEnd);

    return () => {
      events.off("routeChangeStart", handleRouteChangeStart);
      events.off("routeChangeComplete", handleRouteChangeEnd);
      events.off("routeChangeError", handleRouteChangeEnd);
    };
  }, [events]);

  return (
    <>
      <style jsx>{`
        .bar {
          height: 2px;
          margin-left: ${(-1 + progress) * 100}%;
          transition-property: margin-left;
        }
        .spinner {
          width: 100px;
        }
      `}</style>
      <div
        className={`pointer-events-none w-full transition-opacity ease-linear duration-200 z-50 ${
          isFinished ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="fixed top-0 left-0 w-full duration-200 ease-linear bg-yellow-600 bar">
          <div className="absolute right-0 block h-full transform scale-0 -translate-y-1 opacity-100 spinner rotate-3 trnslate-x-0 ring ring-yellow-600 ring-offset-yellow-600" />
        </div>
      </div>
    </>
  );
}
