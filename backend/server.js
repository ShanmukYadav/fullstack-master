require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/error');
const path = require('path');
const createUploadDirs = require('./src/utils/createDirs');

// Initialize express app
const app = express();

// Only connect DB if not in test
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Create upload directories (skip in test if you want)
if (process.env.NODE_ENV !== 'test') {
  createUploadDirs();
}

// Route files
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const itemRoutes = require('./src/routes/items');
const claimRoutes = require('./src/routes/claims');
const notificationRoutes = require('./src/routes/notifications');

// Apply CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // change to frontend domain in prod
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser
app.use(express.json());

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check & test routes
app.get('/api/server-status', (req, res) => {
  console.log('Server status route hit');
  res.status(200).json({
    success: true,
    message: 'Server is working',
    time: new Date().toISOString()
  });
});

// Direct test route
app.post('/api/direct-claim-test', (req, res) => {
  console.log('Direct claim test route hit');
  res.status(201).json({
    success: true,
    message: 'Direct claim test route is working',
    receivedData: req.body,
    time: new Date().toISOString()
  });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/notifications', notificationRoutes);

// Extra test route
app.get('/api/test-route', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Test route is working'
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5003;

// Start server only if run directly (not in tests)
if (require.main === module && process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

module.exports = app;
