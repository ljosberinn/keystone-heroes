import { useCallback, useState } from "react";

export function useToggle(initialState: boolean): [boolean, () => void] {
  const [active, setActive] = useState(initialState);

  const toggle = useCallback(() => {
    setActive((prev) => !prev);
  }, []);

  return [active, toggle];
}
