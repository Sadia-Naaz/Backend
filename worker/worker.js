const { consumeMessage } = require('../queue/queueManager');

async function processQueue(userId) {
  await consumeMessage(userId, async (message) => {
    console.log(`Processing request for user ${userId}: ${message}`);
    // Simulate request processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });
}

module.exports = processQueue;

