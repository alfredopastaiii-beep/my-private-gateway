const express = require('express');
const httpProxy = require('http-proxy');
const app = express();
const proxy = httpProxy.createProxyServer({ changeOrigin: true, followRedirects: true });

// Error handling to prevent crashes
proxy.on('error', (err, req, res) => {
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('The website could not be loaded via proxy. It may have heavy anti-bot security.');
});

// Home page with a clean UI search box
app.get('/', (req, res) => {
  res.send(`
    <style>
      body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #f0f2f5; margin: 0; }
      .box { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; }
      input { width: 300px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; margin-right: 10px; }
      button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
      button:hover { background: #0056b3; }
    </style>
    <div class="box">
      <h2>Private Gateway</h2>
      <p>Enter a URL below to browse securely:</p>
      <input type="text" id="url" placeholder="https://coproxy.io" value="https://coproxy.io">
      <button onclick="go()">Go</button>
    </div>
    <script>
      function go() {
        let target = document.getElementById('url').value;
        if(!target.startsWith('http')) target = 'https://' + target;
        window.location.href = '/service/' + target;
      }
    </script>
  `);
});

// The proxy engine router
app.all('/service/:url*', (req, res) => {
  let targetUrl = req.params.url + req.params[0];
  
  // Clean up potential missing protocol syntax
  if (!targetUrl.startsWith('http')) {
    targetUrl = 'https://' + targetUrl;
  }
  
  proxy.web(req, res, { target: targetUrl });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT);
