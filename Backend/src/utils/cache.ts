// Simple in-memory cache with TTL
interface CacheEntry {
  value: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

export const cacheManager = {
  set(key: string, value: any, ttlSeconds: number = 3600) {
    cache.set(key, {
      value,
      timestamp: Date.now() + ttlSeconds * 1000,
    });
  },

  get(key: string) {
    const entry = cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.timestamp) {
      cache.delete(key);
      return null;
    }

    return entry.value;
  },

  generateKey(problem: string, model1: string, model2: string): string {
    return `battle_${problem}_${model1}_${model2}`;
  },

  clear() {
    cache.clear();
  },
};

// Auto cleanup expired entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
      if (now > entry.timestamp) {
        cache.delete(key);
      }
    }
  },
  5 * 60 * 1000,
);
