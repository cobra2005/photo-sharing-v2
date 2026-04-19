import models from "../modelData/models";

/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 * @returns {Promise}       A Promise that resolves with the response data.
 */
async function fetchModel(url) {
  const response = await fetch(`http://localhost:8081${url}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export default fetchModel;
