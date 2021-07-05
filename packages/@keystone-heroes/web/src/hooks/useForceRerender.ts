import type { DispatchWithoutAction } from "react";
import { useReducer } from "react";

export function useForceRerender(): DispatchWithoutAction {
  const [, redraw] = useReducer<(state: number) => number>((n) => n + 1, 0);

  return redraw;
}
