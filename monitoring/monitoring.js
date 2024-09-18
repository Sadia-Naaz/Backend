const client = require('prom-client');

// Create a counter for processed requests
const requestCounter = new client.Counter({
  name: 'requests_total',
  help: 'Total number of requests processed',
});

// Create a histogram to measure request processing time
const requestDuration = new client.Histogram({
  name: 'request_duration_seconds',
  help: 'Histogram of request processing duration',
});

function incrementRequestCount() {
  requestCounter.inc();
}

function observeRequestDuration(duration) {
  requestDuration.observe(duration);
}

module.exports = { incrementRequestCount, observeRequestDuration };
