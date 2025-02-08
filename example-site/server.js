const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`
    <h1>Test Site ${process.env.SITE_NAME || ''}</h1>
    <p>Hostname: ${req.headers.host}</p>
    <p>Time: ${new Date().toLocaleString()}</p>
  `);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});