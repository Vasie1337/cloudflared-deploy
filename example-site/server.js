const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const siteName = process.env.SITE_NAME || 'Unnamed Site';
const nodeEnv = process.env.NODE_ENV || 'development';

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: nodeEnv,
    siteName
  });
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${siteName}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .container {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .info {
                margin: 10px 0;
                padding: 10px;
                background-color: #f8f9fa;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>${siteName}</h1>
            <div class="info">
                <p><strong>Environment:</strong> ${nodeEnv}</p>
                <p><strong>Hostname:</strong> ${req.headers.host}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Request ID:</strong> ${req.headers['x-request-id'] || 'Not available'}</p>
                <p><strong>IP Address:</strong> ${req.ip || 'Not available'}</p>
                <p><strong>Headers:</strong> ${JSON.stringify(req.headers)}</p>
                <p><strong>Body:</strong> ${JSON.stringify(req.body)}</p>
                <p><strong>Query:</strong> ${JSON.stringify(req.query)}</p>
                <p><strong>Method:</strong> ${req.method}</p>
                <p><strong>Path:</strong> ${req.path}</p>
                <p><strong>User-Agent:</strong> ${req.headers['user-agent'] || 'Not available'}</p>
                <p><strong>Referer:</strong> ${req.headers.referer || 'Not available'}</p>
                <p><strong>X-Forwarded-For:</strong> ${req.headers['x-forwarded-for'] || 'Not available'}</p>
                <p><strong>X-Real-IP:</strong> ${req.headers['x-real-ip'] || 'Not available'}</p>
                <p><strong>X-Forwarded-Host:</strong> ${req.headers['x-forwarded-host'] || 'Not available'}</p>
                <p><strong>X-Forwarded-Proto:</strong> ${req.headers['x-forwarded-proto'] || 'Not available'}</p>
                <p><strong>X-Forwarded-Port:</strong> ${req.headers['x-forwarded-port'] || 'Not available'}</p>
                <p><strong>X-Forwarded-Ssl:</strong> ${req.headers['x-forwarded-ssl'] || 'Not available'}</p>
                <p><strong>X-Forwarded-Server:</strong> ${req.headers['x-forwarded-server'] || 'Not available'}</p>
                <p><strong>X-Forwarded-Prefix:</strong> ${req.headers['x-forwarded-prefix'] || 'Not available'}</p>
                

            </div>
        </div>
    </body>
    </html>
  `);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running in ${nodeEnv} mode on port ${port}`);
  console.log(`Site name: ${siteName}`);
});