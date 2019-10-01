const express = require('express');
const app = express();
const morgan = require('morgan');
const PORT = 8080;
const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5zK': 'http://www.google.com'
};

// APP/SERVER LISTENING...

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

const generateRandomString = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
  }

// POST REQUESTS

app.post('/urls', (req, res) => {
  let newShortUrl = generateRandomString();
  urlDatabase[newShortUrl] = req.body.longURL;
  res.redirect(`/urls/${newShortUrl}`);
  console.log(urlDatabase);
})

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
})

app.post('/urls/:shortURL/edit', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[req.params.shortURL] = req.body.newLongURL;
  res.redirect(`/urls/${shortURL}`);
})

// GET REQUESTS

app.get('/', (req, res) => { // get root
  res.send('Hello');
});

app.get("/urls.json", (req, res) => { // get .json of urls
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => { // get urls index page
  let templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars)
})

app.get('/urls/new', (req, res) => { // get Create New URl page
  res.render('urls_new');
})

app.get('/u/:shortURL', (req, res) => { // redirect to long url when short is clicked
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
})

app.get('/urls/:shortURL', (req, res) => { // shows the urls_show page
  const shortURL = req.params.shortURL;
  let templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL]};
  res.render('urls_show', templateVars);
})

