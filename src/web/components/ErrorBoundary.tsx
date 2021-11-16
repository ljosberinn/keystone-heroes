import type { ErrorInfo } from "react";
import { Component } from "react";

let Sentry: typeof import("@sentry/react") | null = null;

export type ErrorBoundaryProps = {
  children: JSX.Element;
  fallback?: JSX.Element;
};

type State = {
  error: null | Error;
  componentStack: null | ErrorInfo["componentStack"];
  eventId: null | string;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  public state: State = {
    error: null,
    componentStack: null,
    eventId: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      error,
      componentStack: null,
      eventId: null,
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

      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV,
        enabled: process.env.NODE_ENV === "production",
      });

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

    const { withScope, captureException } = Sentry;

    withScope(() => {
      const customError = new Error(error.message);
      customError.name = `React ErrorBoundary ${customError.name}`;
      customError.stack = componentStack;

      error.cause = customError;

      const eventId = captureException(error, {
        contexts: { react: { componentStack } },
      });

      this.setState({
        componentStack,
        eventId,
      });
    });
  }

  public render(): JSX.Element {
    const { children, fallback } = this.props;
    const { error, componentStack, eventId } = this.state;

    if (error) {
      console.log({ componentStack, eventId });
      return fallback ?? <h1>welp</h1>;
    }

    return children;
  }
}
