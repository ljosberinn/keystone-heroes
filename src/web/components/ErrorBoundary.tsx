import type { ErrorInfo } from "react";
import { Component } from "react";

import { sentrySettings } from "../../api/utils/sentrySettings";

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let Sentry: typeof import("@sentry/react") | null = null;

export type ErrorBoundaryProps = {
  children: JSX.Element;
  fallback?: JSX.Element;
};

type State = {
  error: null | Error;
};

function flush(
  error: Error & { cause?: Error },
  componentStack: ErrorInfo["componentStack"]
) {
  if (!Sentry) {
    return;
  }

  const { withScope, captureException } = Sentry;

  withScope(() => {
    const customError = new Error(error.message);
    customError.name = `React ErrorBoundary ${customError.name}`;
    customError.stack = componentStack;

    error.cause = customError;

    captureException(error, {
      contexts: { react: { componentStack } },
    });
  });
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  public state: State = {
    error: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      error,
    };
  }

  public async componentDidCatch(
    error: Error & { cause?: Error },
    { componentStack }: ErrorInfo
  ): Promise<void> {
    if (!Sentry) {
      const lazySentry = await import(
        /* webpackChunkName: "sentry.react" */ "@sentry/react"
      );
      Sentry = Sentry ?? lazySentry;

      Sentry.init(sentrySettings);

      /**
       * @see https://github.com/getsentry/sentry-javascript/blob/b99ee25b16/packages/nextjs/src/index.client.ts#L31
       */
      Sentry.configureScope((scope) => {
        scope.setTag("runtime", "browser");
        scope.addEventProcessor((event) =>
          event.type === "transaction" && event.transaction === "/404"
            ? null
            : event
        );
      });
    }

    flush(error, componentStack);
  }

  public render(): JSX.Element {
    const { children, fallback } = this.props;
    const { error } = this.state;

    if (error) {
      return fallback ?? <h1>welp</h1>;
    }

    return children;
  }
}
