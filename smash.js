const hulken = require('hulken');

const myArrayOfRequests = [{
  method: 'GET',
  path: '/write',
  expectedTextToExist: 'write succeeded'
}];

const hulken_options = {
  targetUrl: 'http://localhost',
  requestsArray: JSON.stringify(myArrayOfRequests),
  timesToRunEachRequest: 1000,
  printLoadDistribution: true
};

hulken.run((stats) => {
  process.exit(1);
}, (stats) => {}, hulken_options);
