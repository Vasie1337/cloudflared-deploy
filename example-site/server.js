const express = require('express');
require('dotenv').config();

const generateMainPage = require('./templates/mainPage');
const { generate404Page, generate500Page } = require('./templates/errorPages');

const app = express();
const port = process.env.PORT || 3000;
const siteName = process.env.SITE_NAME || 'Unnamed Site';
const nodeEnv = process.env.NODE_ENV || 'development';

// Enhanced security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self'; style-src 'self' 'unsafe-inline'");
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: nodeEnv,
    siteName,
    version: '1.0.0'
  });
});

app.get('/', (req, res) => {
  res.send(generateMainPage(req, siteName, nodeEnv));
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(generate404Page(siteName));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(generate500Page(siteName, nodeEnv, err));
});

app.listen(port, () => {
  console.log(`Server running in ${nodeEnv} mode on port ${port}`);
  console.log(`Site name: ${siteName}`);
  console.log(`Server started at: ${new Date().toISOString()}`);
});