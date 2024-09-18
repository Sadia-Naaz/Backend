const amqp = require('amqplib');

async function createQueue(userId) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queueName = `queue_${userId}`;
  await channel.assertQueue(queueName, { durable: true });
  return { connection, channel, queueName };
}

async function sendMessage(userId, message) {
  const { connection, channel, queueName } = await createQueue(userId);
  channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
  setTimeout(() => connection.close(), 500); // Close connection after sending
}

async function consumeMessage(userId, callback) {
  const { connection, channel, queueName } = await createQueue(userId);
  channel.consume(queueName, (msg) => {
    if (msg !== null) {
      callback(msg.content.toString());
      channel.ack(msg); // Acknowledge message
    }
  });
}

module.exports = { sendMessage, consumeMessage };
