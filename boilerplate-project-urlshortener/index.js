require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const shortid = require('shortid');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urls = {};

app.post('/api/shorturl', (req, res) => {
  const isValidUrl = urlString=> {
      var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
      '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
    return !!urlPattern.test(urlString);
  }
  const original_url = req.body.url;
  if(isValidUrl(original_url)) {    
    const short_url = shortid.generate();
    urls[short_url] = original_url;
    obj = { original_url: original_url, short_url: short_url };
    res.json(obj);
  } else {
    return res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:short', (req, res) => {
  if(urls[req.params.short])
    return res.redirect(urls[req.params.short]);
  else 
    return res.json({ error: 'invalid url' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
