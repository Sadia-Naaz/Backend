const express = require('express');
const client = require('prom-client');
const router = express.Router();

// Expose Prometheus metrics
router.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = router;

