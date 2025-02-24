const { formatJSON, getEnvironmentColor } = require('../utils/formatters');

function generateMainPage(req, siteName, nodeEnv) {
  const keyHeaders = {
    'user-agent': req.headers['user-agent'],
    'accept-language': req.headers['accept-language'],
    'host': req.headers.host,
    'referer': req.headers.referer || 'None',
    'x-forwarded-for': req.headers['x-forwarded-for'] || req.ip || 'Unknown'
  };
  
  const now = new Date();

  const allHeadersFormatted = formatJSON(req.headers);
  
  return `<!DOCTYPE html>
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
                <!-- ... server info cards ... -->
            </div>
            
            <div class="tabs">
                <div class="tab-buttons">
                    <button class="tab-button active" onclick="switchTab('key-headers', event)">Key Headers</button>
                    <button class="tab-button" onclick="switchTab('all-headers', event)">All Headers</button>
                    <button class="tab-button" onclick="switchTab('server-env', event)">Server Environment</button>
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
        
        <script src="/js/tabs.js"></script>
    </body>
    </html>`;
}

module.exports = generateMainPage; 