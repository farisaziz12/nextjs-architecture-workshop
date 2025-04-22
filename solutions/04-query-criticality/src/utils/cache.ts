export const cacheManager = {
  set: <T>(key: string, data: T, cacheTime = 60_000) => {
    localStorage.setItem(
      key,
      JSON.stringify({
        expirationTime: Date.now() + cacheTime,
        data,
      })
    );
  },

  get: <T>(key: string): T | null => {
    const cachedItem = localStorage.getItem(key);

    if (!cachedItem) return null;

    const { expirationTime, data } = JSON.parse(cachedItem);

    // only return if data is not considered stale

    const isStale = Date.now() > expirationTime;

    console.log(isStale ? "Purging cache" : "Using cache");

    if (isStale) {
      cacheManager.clear(key);
      return null;
    }

    return data;
  },

  clear: (key: string) => {
    localStorage.removeItem(key);
  },
};
