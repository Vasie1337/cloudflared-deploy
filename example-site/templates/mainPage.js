const { formatJSON, getEnvironmentColor } = require('../utils/formatters');

function generateMainPage(req, siteName, nodeEnv) {
  // Extract key headers for display
  const keyHeaders = {
    'user-agent': req.headers['user-agent'],
    'accept-language': req.headers['accept-language'],
    'host': req.headers.host,
    'referer': req.headers.referer || 'None',
    'x-forwarded-for': req.headers['x-forwarded-for'] || req.ip || 'Unknown'
  };
  
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

  const allHeadersFormatted = formatJSON(req.headers);
  
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${siteName} - ${nodeEnv.toUpperCase()}</title>
        <style>
            /* ... existing styles ... */
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