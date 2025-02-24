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
            <!-- ... existing HTML ... -->
        </div>
        
        <script>
            function switchTab(tabId, event) {
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
                event.target.classList.add('active');
            }
        </script>
    </body>
    </html>`;
}

module.exports = generateMainPage; 