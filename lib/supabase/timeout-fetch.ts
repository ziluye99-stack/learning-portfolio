const defaultTimeoutMs = 3000;

export function createTimeoutFetch(timeoutMs = defaultTimeoutMs): typeof fetch {
  return async (input, init = {}) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(input, {
        ...init,
        signal: init.signal || controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }
  };
}
