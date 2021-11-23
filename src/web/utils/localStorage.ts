export const ls = (() => {
  const isSupported = (() => {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      const key = "ls-test";
      localStorage.setItem(key, key);
      localStorage.removeItem(key);

      return true;
    } catch {
      return false;
    }
  })();

  return {
    set: (key: string, value: string) => {
      if (!isSupported) {
        return;
      }

      localStorage.setItem(key, value);
    },

    get: (key: string): string | null => {
      if (!isSupported) {
        return null;
      }

      return localStorage.getItem(key);
    },
    remove: (key: string) => {
      if (!isSupported) {
        return;
      }

      localStorage.removeItem(key);
    },
  };
})();
