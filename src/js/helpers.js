import { TIMEOUT_SEC } from './config';

/**
 * Timeout function, that returns a promise, which we can await to start the timer.
 * @param {number} s time in sec (how long should the timer be...).
 * @returns {Promise} return timeout as Promise to let it 'race' against the fetch later.
 */
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/**
 * Responsible for fetching data (e.g API) or sending data to third party, if second argument is passed in. Rethrow error to propagate it down to controller.js.
 * @param {string} url the url we want to fetch or send data to.
 * @param {object | undefined} [uploadData=undefined] can be passed in if we want to send data to the API.
 * @returns {object} the data we fetched from the API or got back after sending data to API.
 */
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
