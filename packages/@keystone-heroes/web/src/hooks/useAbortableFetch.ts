import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useIsMounted } from "./useIsMounted";
import { usePrevious } from "./usePrevious";

export function useAbortableFetch<T>({
  url,
  options,
  initialState = null,
}: {
  url: RequestInfo | null;
  options?: Omit<RequestInit, "signal">;
  initialState: T | null;
}): [T | null, boolean, () => void] {
  const [{ data, loading }, setState] = useState<{
    data: T | null;
    loading: boolean;
  }>({
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

    async function load(url: RequestInfo) {
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
    };
  }, [loading, url, options, isMounted]);

  useEffect(() => {
    // run when initially executed or whenever the url changes
    if (firstRenderRef.current || url !== previousUrl) {
      firstRenderRef.current = false;
      setState({ data: null, loading: true });
    }
  }, [url, previousUrl]);

  const trigger = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true }));
  }, []);

  return useMemo(() => [data, loading, trigger], [data, loading, trigger]);
}
