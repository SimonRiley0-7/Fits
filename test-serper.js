const https = require('https');

const data = JSON.stringify({
  q: "mens oversized black t-shirt buy online myntra ajio",
  gl: "in"
});

const options = {
  hostname: 'google.serper.dev',
  path: '/shopping',
  method: 'POST',
  headers: {
    'X-API-KEY': process.env.SERPER_API_KEY,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => {
    const json = JSON.parse(body);
    console.log(JSON.stringify(json.shopping.slice(0,2), null, 2));
  });
});

req.on('error', (error) => console.error(error));
req.write(data);
req.end();
