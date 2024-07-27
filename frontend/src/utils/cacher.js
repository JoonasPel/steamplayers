import axios from 'axios';

const TTLSeconds = 100;
// key "url" - value [response.data, timestampSeconds]
const urlCache = new Map();

/**
 * Fetches and caches data from a URL. If the URL/data is in cache and has been there < TTL,
 * returns cached data. otherwise, fetches and saves to cache, then returns new data.
 * if fetching fails, returns undefined
 * @param {string} url (FULL URL WITH PARAMS!)
 * @returns {Promise<Object|undefined>} RESPONSE.DATA !!!
 */
const fetcher = async (url) => {
  const currTimestampSeconds = Math.round(Date.now() / 1000);

  try { 
    const cached = urlCache.get(url);
    if (cached && currTimestampSeconds - cached[1] < TTLSeconds) {
      return cached[0];
    } else {
      const response = await axios.get(url, {
        timeout: 10000,
      });
      urlCache.set(url, [response.data, currTimestampSeconds]);
      return response.data;
    }

  } catch (error) {
    console.warn("failed to fetch");
    return undefined;
  }
};




export default fetcher;