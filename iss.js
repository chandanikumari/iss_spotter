/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  //const APIKey = "at_q6azLtg2trRnqKoLsGWMiPjygPDri";
  const URL = `https://api.ipify.org?format=json`;
  console.log("Fetching data...");
  request(URL, (err, response, body) => {
    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (err) {
      callback(err, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP.`;
      callback(msg, null);
      return;
    }

    // if we get here, all's well and we got the data
    const ipAddress = JSON.parse(body).ip;
    callback(null, ipAddress);

  });
};

const fetchCoordsByIP = function(ip, callback) {
  //const APIKey = "ff9919040cb52beea98604fe2f9d2a61";
  
  const URL = `http://ipwho.is/${ip}`;
  console.log("This is the URL:", URL);
  console.log("Fetching data...");
  request(URL, (err, response, body) => {

    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (err) {
      callback(err, null);
      return;
    }
    // parse the returned body so we can check its information
    const parsedBody = JSON.parse(body);
    // check if "success" is true or not
    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP`;
      callback(Error(message), null);
      return;
    }
    const { latitude, longitude } = parsedBody;
    callback(null,{latitude, longitude});
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  // ...
  const URL = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  console.log("Fetching data...");
  request(URL, (err, response, body) => {

    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (err) {
      callback(err, null);
      return;
    }
    // parse the returned body so we can check its information
    const pass = JSON.parse(body).response;
    // check if "success" is true or not
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
    callback(null,pass);
  });
};


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  // empty for now
  fetchMyIP((err, ip) => {
    if (err) {
      callback(err, null);
      return;
    }
    fetchCoordsByIP(ip, (err , location) => {
      if (err) {
        callback(err, null);
        return;
      }
      fetchISSFlyOverTimes(location, (err, nextPass) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(err, nextPass);
      });
    });
  });
};


module.exports = nextISSTimesForMyLocation;