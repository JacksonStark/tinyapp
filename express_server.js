const express = require('express');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselsbd.ca',
  '9sm5zK': 'http://www.google.com'
};

// APP/SERVER LISTENING...

app.listen(PORT, () => {
  console.log(`Example app sslistxxening on port ${PORT}!`);
});

// GET REQUESTS

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/urls', (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars)
})

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello\n<br><b>World</b></body></html>\n')
});

