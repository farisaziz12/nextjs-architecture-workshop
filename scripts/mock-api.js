#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Settings with defaults
let settings = {
  failureRate: parseFloat(process.env.MOCK_API_FAILURE_RATE || '0.2'),
  latencyMin: 100,
  latencyMax: 800,
  timeout: false,
  malformedData: false,
  criticalEndpointFailure: false,  // New setting for critical endpoint
  optionalEndpointFailure: false   // New setting for optional endpoint
};

// Mock data
const products = require('../core-app/mocks/products');
const users = require('../core-app/mocks/users');
const orders = require('../core-app/mocks/orders');

// Mock analytics data
const analyticsData = {
  dailyVisitors: 2345,
  conversionRate: 3.7,
  bounceRate: 42.1,
  averageSessionTime: "2:15",
  topReferrers: ["google.com", "facebook.com", "twitter.com"],
  deviceBreakdown: {
    desktop: 65,
    mobile: 30,
    tablet: 5
  }
};

app.use(cors());
app.use(express.json());

// API control dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../core-app/mocks/dashboard.html'));
});

// Get current settings
app.get('/settings', (req, res) => {
  res.json(settings);
});

// Update settings
app.post('/settings', (req, res) => {
  settings = { ...settings, ...req.body };
  io.emit('settings-updated', settings);
  res.json(settings);
});

// Products API
app.get('/api/products', (req, res) => {
  handleRequest(req, res, () => ({
    products: products.slice(0, 12),
    total: products.length
  }));
});

app.get('/api/products/:id', (req, res) => {
  handleRequest(req, res, () => {
    const product = products.find(p => p.id.toString() === req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    return product;
  });
});

// Users API
app.get('/api/users/profile', (req, res) => {
  handleRequest(req, res, () => users[0]);
});

// Orders API
app.get('/api/orders', (req, res) => {
  handleRequest(req, res, () => orders);
});

// Transactions API - Critical Endpoint
app.get('/api/transactions', (req, res) => {
  // Force failure based on criticalEndpointFailure setting
  if (settings.criticalEndpointFailure) {
    return res.status(500).json({ error: 'Critical Endpoint Failure' });
  }
  
  handleRequest(req, res, () => {
    const quantity = parseInt(req.query.quantity) || 1;
    return {
      totalAmount: 125000 * quantity,
      domesticCount: 142 * quantity,
      internationalCount: 87 * quantity,
      amountsByCardType: {
        "Visa": 52000 * quantity,
        "Mastercard": 43000 * quantity,
        "American Express": 30000 * quantity
      }
    };
  });
});

// Analytics API - Optional Endpoint
app.get('/api/analytics', (req, res) => {
  // Force failure based on optionalEndpointFailure setting
  if (settings.optionalEndpointFailure) {
    return res.status(500).json({ error: 'Optional Endpoint Failure' });
  }
  
  handleRequest(req, res, () => analyticsData);
});

// Generic request handler with chaos options
function handleRequest(req, res, dataFn) {
  // Random failure
  if (Math.random() < settings.failureRate) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  
  // Random timeout
  if (settings.timeout && Math.random() < 0.3) {
    // Request will hang until client timeout
    return;
  }
  
  // Random latency
  const latency = Math.floor(
    settings.latencyMin + 
    Math.random() * (settings.latencyMax - settings.latencyMin)
  );
  
  setTimeout(() => {
    try {
      const data = dataFn();
      
      // Random malformed data
      if (settings.malformedData && Math.random() < 0.3) {
        const malformed = JSON.parse(
          JSON.stringify(data).replace(/"(\w+)":/g, (m, p1) => {
            return Math.random() < 0.2 ? `"corrupted_${p1}":` : m;
          })
        );
        return res.json(malformed);
      }
      
      res.json(data);
    } catch (error) {
      console.error('Error generating response:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }, latency);
}

// Socket.io for real-time communication
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit('settings-updated', settings);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = process.env.MOCK_API_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
  console.log(`View control dashboard at http://localhost:${PORT}`);
});