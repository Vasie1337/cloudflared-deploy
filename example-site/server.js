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
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
            }
            th, td {
                padding: 10px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            th {
                background-color: #f2f2f2;
                font-weight: bold;
            }
            tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            tr:hover {
                background-color: #f1f1f1;
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
                
                <h2>Request Headers</h2>
                <table>
                    <tr>
                        <th>Header</th>
                        <th>Value</th>
                    </tr>
                    <tr>
                        <td>Cloudflare IP</td>
                        <td>${req.headers['cf-connecting-ip'] || 'Not available'}</td>
                    </tr>
                    <tr>
                        <td>Cloudflare Country</td>
                        <td>${req.headers['cf-ipcountry'] || 'Not available'}</td>
                    </tr>
                    <tr>
                        <td>Cloudflare Ray ID</td>
                        <td>${req.headers['cf-ray'] || 'Not available'}</td>
                    </tr>
                    <tr>
                        <td>Client Platform</td>
                        <td>${req.headers['sec-ch-ua-platform'] || 'Not available'}</td>
                    </tr>
                    <tr>
                        <td>Client Bitness</td>
                        <td>${req.headers['sec-ch-ua-bitness'] || 'Not available'}</td>
                    </tr>
                    <tr>
                        <td>X-Forwarded-For</td>
                        <td>${req.headers['x-forwarded-for'] || 'Not available'}</td>
                    </tr>
                    <tr>
                        <td>X-Forwarded-Proto</td>
                        <td>${req.headers['x-forwarded-proto'] || 'Not available'}</td>
                    </tr>
                    <tr>
                        <td>User Agent</td>
                        <td>${req.headers['user-agent'] || 'Not available'}</td>
                    </tr>
                </table>
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