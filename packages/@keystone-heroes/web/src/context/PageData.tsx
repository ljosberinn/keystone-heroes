import { createContext, useContext } from "react";

type PageContextType<T extends Record<string, unknown>> = [
  () => T,
  (Component: (props: T) => JSX.Element | null) => (props: T) => JSX.Element
];

export function createPageContext<T extends Record<string, unknown>>(
  contextDisplayName?: string
): PageContextType<T> {
  const PageContext = createContext<null | T>(null);

  if (contextDisplayName) {
    PageContext.displayName = contextDisplayName;
  }

  function withPageContext(Component: (props: T) => JSX.Element | null) {
    function PageContextProvider(props: T): JSX.Element {
      return (
        <PageContext.Provider value={props}>
          <Component {...props} />
        </PageContext.Provider>
      );
    }

    if (contextDisplayName) {
      PageContextProvider.displayName = `${contextDisplayName}Provider`;
    }

    return PageContextProvider;
  }

  function usePageContext(): T {
    const ctx = useContext(PageContext);

    if (!ctx) {
      throw new Error(
        "usePageContext must be called in the corresponding page"
      );
    }

    return ctx;
  }

  return [usePageContext, withPageContext];
}
