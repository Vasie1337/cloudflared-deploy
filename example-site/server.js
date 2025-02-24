const express = require('express');
require('dotenv').config();

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

// Helper function to format JSON nicely for display
const formatJSON = (obj) => {
  return JSON.stringify(obj, null, 2)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>')
    .replace(/ /g, '&nbsp;');
};

// Helper to get a color based on environment
const getEnvironmentColor = (env) => {
  switch(env.toLowerCase()) {
    case 'production':
      return '#dc3545';
    case 'staging':
      return '#fd7e14';
    case 'testing':
      return '#ffc107';
    case 'development':
    default:
      return '#28a745';
  }
};

app.get('/', (req, res) => {
  // Extract key headers for display
  const keyHeaders = {
    'user-agent': req.headers['user-agent'],
    'accept-language': req.headers['accept-language'],
    'host': req.headers.host,
    'referer': req.headers.referer || 'None',
    'x-forwarded-for': req.headers['x-forwarded-for'] || req.ip || 'Unknown'
  };
  
  // Create a formatted time with date and time parts
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  // Generate tabs for different header sections
  const allHeadersFormatted = formatJSON(req.headers);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${siteName} - ${nodeEnv.toUpperCase()}</title>
        <style>
            :root {
                --bg-color: #f8f9fa;
                --text-color: #212529;
                --header-color: ${getEnvironmentColor(nodeEnv)};
                --border-color: #dee2e6;
                --hover-color: #e9ecef;
                --card-bg: #ffffff;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 900px;
                margin: 0 auto;
                padding: 20px;
                background-color: var(--bg-color);
                color: var(--text-color);
                line-height: 1.6;
            }
            
            .container {
                background-color: var(--card-bg);
                padding: 25px;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-bottom: 15px;
                border-bottom: 1px solid var(--border-color);
                margin-bottom: 20px;
            }
            
            .title-area h1 {
                margin: 0;
                font-size: 32px;
                color: var(--text-color);
            }
            
            .environment-badge {
                background-color: var(--header-color);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                text-transform: uppercase;
                font-size: 14px;
                letter-spacing: 1px;
            }
            
            .server-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 25px;
            }
            
            .info-card {
                background-color: var(--bg-color);
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid var(--header-color);
            }
            
            .info-card h3 {
                margin: 0 0 10px 0;
                font-size: 18px;
                color: var(--header-color);
            }
            
            .info-card p {
                margin: 5px 0;
                word-break: break-word;
            }
            
            .tabs {
                margin-top: 25px;
            }
            
            .tab-buttons {
                display: flex;
                border-bottom: 1px solid var(--border-color);
                margin-bottom: 15px;
            }
            
            .tab-button {
                padding: 10px 20px;
                background: none;
                border: none;
                border-bottom: 3px solid transparent;
                cursor: pointer;
                font-weight: bold;
                color: var(--text-color);
                opacity: 0.7;
                transition: all 0.3s;
            }
            
            .tab-button.active {
                border-bottom: 3px solid var(--header-color);
                opacity: 1;
            }
            
            .tab-button:hover {
                background-color: var(--hover-color);
                opacity: 1;
            }
            
            .tab-content {
                display: none;
                padding: 15px;
                background-color: var(--bg-color);
                border-radius: 8px;
                overflow: auto;
                max-height: 400px;
            }
            
            .tab-content.active {
                display: block;
            }
            
            .code-block {
                font-family: monospace;
                white-space: pre-wrap;
                font-size: 14px;
                line-height: 1.5;
            }
            
            footer {
                margin-top: 25px;
                text-align: center;
                font-size: 14px;
                color: #6c757d;
            }
            
            @media (max-width: 768px) {
                .server-info {
                    grid-template-columns: 1fr;
                }
                
                .tab-buttons {
                    flex-wrap: wrap;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <div class="title-area">
                    <h1>${siteName}</h1>
                </div>
                <div class="environment-badge">${nodeEnv}</div>
            </header>
            
            <div class="server-info">
                <div class="info-card">
                    <h3>Server Information</h3>
                    <p><strong>Hostname:</strong> ${req.headers.host}</p>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Time:</strong> ${formattedTime}</p>
                    <p><strong>Client IP:</strong> ${req.headers['x-forwarded-for'] || req.ip || 'Unknown'}</p>
                </div>
                <div class="info-card">
                    <h3>Request Details</h3>
                    <p><strong>User Agent:</strong> ${keyHeaders['user-agent'] || 'Unknown'}</p>
                    <p><strong>Language:</strong> ${keyHeaders['accept-language'] || 'Not specified'}</p>
                    <p><strong>Referrer:</strong> ${keyHeaders.referer}</p>
                    <p><strong>Protocol:</strong> ${req.protocol.toUpperCase()}</p>
                </div>
            </div>
            
            <div class="tabs">
                <div class="tab-buttons">
                    <button class="tab-button active" onclick="switchTab('key-headers')">Key Headers</button>
                    <button class="tab-button" onclick="switchTab('all-headers')">All Headers</button>
                    <button class="tab-button" onclick="switchTab('server-env')">Server Environment</button>
                </div>
                
                <div id="key-headers" class="tab-content active">
                    <div class="code-block">
                        ${formatJSON(keyHeaders)}
                    </div>
                </div>
                
                <div id="all-headers" class="tab-content">
                    <div class="code-block">
                        ${allHeadersFormatted}
                    </div>
                </div>
                
                <div id="server-env" class="tab-content">
                    <div class="code-block">
                        ${formatJSON({
                          'Site Name': siteName,
                          'Environment': nodeEnv,
                          'Node Version': process.version,
                          'Platform': process.platform,
                          'Process ID': process.pid,
                          'Server Time': now.toISOString(),
                          'Memory Usage': process.memoryUsage().rss + ' bytes'
                        })}
                    </div>
                </div>
            </div>
            
            <footer>
                <p>Server running since ${new Date(Date.now() - process.uptime() * 1000).toLocaleString()}</p>
            </footer>
        </div>
        
        <script>
            function switchTab(tabId) {
                // Hide all tab content
                document.querySelectorAll('.tab-content').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Deactivate all tab buttons
                document.querySelectorAll('.tab-button').forEach(button => {
                    button.classList.remove('active');
                });
                
                // Show selected tab content
                document.getElementById(tabId).classList.add('active');
                
                // Activate clicked button
                event.currentTarget.classList.add('active');
            }
        </script>
    </body>
    </html>
  `);
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Not Found | ${siteName}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 50px 20px;
                text-align: center;
                background-color: #f8f9fa;
                color: #212529;
                line-height: 1.6;
            }
            
            h1 {
                font-size: 72px;
                margin: 0;
                color: #dc3545;
            }
            
            p {
                margin: 20px 0;
            }
            
            a {
                color: #007bff;
                text-decoration: none;
            }
            
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <p><a href="/">Return to Homepage</a></p>
    </body>
    </html>
  `);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>500 - Server Error | ${siteName}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 50px 20px;
                text-align: center;
                background-color: #f8f9fa;
                color: #212529;
                line-height: 1.6;
            }
            
            h1 {
                font-size: 72px;
                margin: 0;
                color: #dc3545;
            }
            
            p {
                margin: 20px 0;
            }
            
            a {
                color: #007bff;
                text-decoration: none;
            }
            
            a:hover {
                text-decoration: underline;
            }
            
            .error-details {
                margin: 30px 0;
                padding: 15px;
                background-color: #f1f1f1;
                border-radius: 5px;
                text-align: left;
                font-family: monospace;
                white-space: pre-wrap;
                display: ${nodeEnv === 'production' ? 'none' : 'block'};
            }
        </style>
    </head>
    <body>
        <h1>500</h1>
        <h2>Server Error</h2>
        <p>Something went wrong on our end. Please try again later.</p>
        <div class="error-details">
            ${nodeEnv !== 'production' ? err.stack : ''}
        </div>
        <p><a href="/">Return to Homepage</a></p>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running in ${nodeEnv} mode on port ${port}`);
  console.log(`Site name: ${siteName}`);
  console.log(`Server started at: ${new Date().toISOString()}`);
});