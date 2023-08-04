// index.js
//const { fetchMyIP } = require('./iss');
// const {fetchCoordsByIP} = require('./iss');
// const fetchISSFlyOverTimes = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log('It worked! Returned IP:' , ip);
// });
//const ip = '172.218.95.114';
// fetchCoordsByIP('172.218.95.114', (error, data) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }
//   console.log('It worked! Data:', data);
// });
// const coords = { latitude: 49.2827291, longitude: -123.1207375 };
// fetchISSFlyOverTimes(coords, (error, pass) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }
//   console.log('It worked! Data:', pass);
// });
const nextISSTimesForMyLocation = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  console.log(passTimes);
});


