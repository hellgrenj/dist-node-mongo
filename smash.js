const hulken = require('hulken');

const myArrayOfRequests = [{
  method: 'GET',
  path: '/write',
  expectedTextToExist: 'write succeeded'
}];

const hulken_options = {
  targetUrl: 'http://localhost',
  requestsArray: JSON.stringify(myArrayOfRequests),
  minWaitTime: 1000,
  maxWaitTime: 10000,
  happyTimeLimit: 20000,
  timesToRunEachRequest: 1000,
  printLoadDistribution: true
};

hulken.run((stats) => {
  process.exit(1);
}, (stats) => {}, hulken_options);
