import { useNProgress } from "@tanem/react-nprogress";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { classnames } from "../utils/classnames";

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

  const container = classnames(
    "pointer-events-none",
    // size
    "w-full",
    // animation
    "transition-opacity",
    "ease-linear",
    "duration-200",
    // visibility
    "z-50",
    isFinished ? "opacity-0" : "opacity-100"
  );

  const bar = classnames(
    "bar",
    // positioning
    "fixed",
    "top-0",
    "left-0",
    // size
    "w-full",
    // animation
    "ease-linear",
    "duration-200",
    // color
    "bg-yellow-600"
  );

  const spinner = classnames(
    "spinner",
    // positioning
    "absolute",
    "block",
    "right-0",
    "h-full",
    // visibility
    "opacity-100",
    // animation
    "transform",
    "scale-0",
    "rotate-3",
    "translate-x-0",
    "-translate-y-1",
    // color
    "ring",
    "ring-yellow-600",
    "ring-offset-yellow-600"
  );

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
      <div className={container}>
        <div className={bar}>
          <div className={spinner} />
        </div>
      </div>
    </>
  );
}
