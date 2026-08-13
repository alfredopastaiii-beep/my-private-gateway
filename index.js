const express = require('express');
const Unblocker = require('unblocker');
const app = express();

const unblocker = new Unblocker({ prefix: '/proxy/' });
app.use(unblocker);

app.get('/', (req, res) => {
  res.send('<h1>Gateway Active</h1><p>To use, add: /proxy/https://website.com to your address bar.</p>');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
}).on('upgrade', unblocker.onUpgrade);
