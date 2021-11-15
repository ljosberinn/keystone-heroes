import type { MutableRefObject } from "react";
import { useEffect, useRef } from "react";

export function useIsMounted(): MutableRefObject<boolean> {
  const ref = useRef(false);

  useEffect(() => {
    ref.current = true;

    return () => {
      ref.current = false;
    };
  }, []);

  return ref;
}
