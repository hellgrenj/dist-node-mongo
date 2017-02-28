const hulken = require('hulken');

const myArrayOfRequests = [{
  method: 'GET',
  path: '/write',
  expectedTextToExist: 'write succeeded'
}];

const hulken_options = {
  targetUrl: 'http://localhost',
  requestsArray: JSON.stringify(myArrayOfRequests),
  timesToRunEachRequest: 3000
};

hulken.run((stats) => {
  process.exit(1);
}, (stats) => {}, hulken_options);
