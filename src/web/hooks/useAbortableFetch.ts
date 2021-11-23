import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useIsMounted } from "./useIsMounted";
import { usePrevious } from "./usePrevious";

type State<T> = {
  data: T | null;
  loading: boolean;
};

const threshold = 750;

export function useAbortableFetch<T>({
  url,
  options,
  initialState = null,
}: {
  url: RequestInfo | null;
  options?: Omit<RequestInit, "signal">;
  initialState: T | null;
}): [T | null, boolean, () => void] {
  const [{ data, loading }, setState] = useState<State<T>>({
    data: initialState,
    loading: false,
  });

  const previousUrl = usePrevious(url);
  const isMounted = useIsMounted();
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (!loading || !url) {
      return;
    }

    const controller = new AbortController();

    let timeout: NodeJS.Timeout | null = null;

    async function load(url: RequestInfo) {
      const start = Date.now();

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        if (!isMounted.current) {
          return;
        }

        const json: T = await response.json();

        if (!isMounted.current) {
          return;
        }

        const end = Date.now();
        const elapsed = end - start;
        const diff = threshold - elapsed;

        // delay setting state to a min elapsed time of threshold
        // but only if the request wasn't cached
        if (diff > 0 && elapsed > 100) {
          timeout = setTimeout(() => {
            setState({ data: json, loading: false });
          }, diff);
          return;
        }

        setState({ data: json, loading: false });
      } catch (error) {
        setState({ data: null, loading: false });

        if (!(error instanceof DOMException)) {
          throw error;
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    load(url);

    return () => {
      controller.abort();

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [loading, url, options, isMounted]);

  useEffect(() => {
    // run when initially executed or whenever the url changes

    if (firstRenderRef.current || url !== previousUrl) {
      setState({ data: null, loading: true });
    }
  }, [url, previousUrl]);

  const trigger = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true }));
  }, []);

  return useMemo(() => [data, loading, trigger], [data, loading, trigger]);
}
