const express = require('express');
const Corrosion = require('corrosion');
const app = express();

// Initialize the advanced layout rewriter engine
const proxy = new Corrosion({
    prefix: '/service/',
    codec: 'xhtml', // Safe encoding for styles and text layouts
    forceURL: true
});

// Home search dashboard UI
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
      <h2>Advanced Gateway</h2>
      <p>Enter a URL below to browse with full formatting:</p>
      <input type="text" id="url" placeholder="https://coproxy.io" value="https://coproxy.io">
      <button onclick="go()">Go</button>
    </div>
    <script>
      function go() {
        let target = document.getElementById('url').value;
        if(!target.startsWith('http')) target = 'https://' + target;
        // Correct path syntax for the advanced layout engine
        window.location.href = '/service/' + proxy.codec.encode(target);
      }
      // Quick fallback encoder logic for front-end safety
      const proxy = { codec: { encode: (str) => btoa(str).replace(/\\//g, '_').replace(/\\+/g, '-') } };
    </script>
  `);
});

// Route network requests through the rewriter proxy engine
app.use((req, res) => {
    if (req.url.startsWith('/service/')) {
        proxy.request(req, res);
    } else {
        res.status(404).send('Not Found');
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Proxy running smoothly'));
