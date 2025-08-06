const cache = new Map();

// Get cached data with limit
function getCache(key, maxLimit = 60) {
  const entry = cache.get(key);
  if (!entry) return null;
  const age = (Date.now() - entry.timestamp) / 1000;
  if (age > maxLimit) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

//Store cached data with a timestamp
function setCache(key, value) {
  cache.set(key, { value, timestamp: Date.now() });
}

module.exports = { getCache, setCache };
