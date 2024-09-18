require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const processQueue = require('./worker/worker');
const { sendMessage } = require('./queue/queueManager');
const { incrementRequestCount, observeRequestDuration } = require('./monitoring/monitoring');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Prometheus metrics
app.use('/metrics', require('./routes/metrics'));

// Enqueue request
app.post('/enqueue', async (req, res) => {
  const { userId, message } = req.body;

  try {
    const startTime = Date.now();
    await sendMessage(userId, message);
    const duration = (Date.now() - startTime) / 1000;
    
    incrementRequestCount();
    observeRequestDuration(duration);
    
    res.json({ msg: 'Request enqueued successfully' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Start processing for a user (Worker)
processQueue(1); // You can scale this with different user IDs

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
