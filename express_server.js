const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080;

app.use(cookieParser())
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');

const urlDatabase = {
  'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', userID: 'example1' },
  '9sm5zK': { longURL: 'http://www.google.com', userID: 'example2' }
};

const users = {

};

// APP/SERVER LISTENING...

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// OTHER FUNCTIONS AND METHODS...

const generateRandomString = () => { // creates unique id
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
  }

const emailLookup = (email) => { // checks if email is in database
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return false;
}

// POST REQUESTS

app.post('/urls', (req, res) => { // creates short url and links there
  let newShortUrl = generateRandomString();
  urlDatabase[newShortUrl] = {longURL: req.body.longURL, userID: req.cookies['user'].id};
  console.log(urlDatabase)
  res.redirect(`/urls/${newShortUrl}`);
})

app.post('/urls/:shortURL/delete', (req, res) => { // deletes url and refreshes
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
})

app.post('/urls/:shortURL/edit', (req, res) => { // modifies existing url and refreshes
  const shortURL = req.params.shortURL;
  urlDatabase[req.params.shortURL] = req.body.newLongURL;
  res.redirect(`/urls/${shortURL}`);
})

app.post('/login', (req, res) => { // logs in and records user (cookie)
  const user = emailLookup(req.body.email);

  if (!user) { // Sending error if email is not in system
    res.status(403);
    let templateVars = { statusCode: res.statusCode, message: 'Email cannot be found'}
    res.render('error', templateVars);
  } else if (req.body.password !== user.password) { // Sending error if password is incorrect
    res.status(403);
    let templateVars = { statusCode: res.statusCode, message: 'Password is incorrect'} 
    res.render('error', templateVars);
  }

  res.cookie('user', user);
  res.redirect('/urls');
})

app.post('/logout', (req, res) => { // logs out and clears user (cookie)
  res.clearCookie('user');
  res.redirect('/urls');
})

app.post('/register', (req, res) => { // creates new account and user cookie, records them in database
  const userObject = emailLookup(req.body.email);
  const email = req.body.email;
  const password = req.body.password;
  const uID = generateRandomString();
  if (userObject.email === email) {
    res.status(400);
    let templateVars = { statusCode: res.statusCode, message: 'Email already in use!'}
    res.render('error', templateVars)
  } else if (!email || !password) {
    res.status(400);
    let templateVars = { statusCode: res.statusCode, message: ' Password or Email not entered!'}
    res.render('error', templateVars)
  } else {
    users[uID] = {};
    const user = users[uID];
    user.id = uID;
    user.email = email;
    user.password = password;
    res.cookie('user', user);
    console.log('Users Object: ', users);
    res.redirect('/urls')
  }
})


// GET REQUESTS

app.get('/', (req, res) => { // get root
  res.send('Hello');
});

app.get("/urls.json", (req, res) => { // get .json of urls
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => { // get urls index page
  let templateVars = { urls: urlDatabase};
  res.render('urls_index', templateVars)
});

app.get('/urls/new', (req, res) => { // get Create New URl page
  
  if (!req.cookies['user']) {
    res.redirect('/login');
  }
  let templateVars = { user: req.cookies['user'] }
  res.render('urls_new', templateVars);
});

app.get('/u/:shortURL', (req, res) => { // redirect to long url when short is clicked
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get('/urls/:shortURL', (req, res) => { // shows the urls_show page
  const shortURL = req.params.shortURL;
  let templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL].longUrl, user: req.cookies['user']};
  res.render('urls_show', templateVars);
});

app.get('/register', (req, res) => { // get Register page
  res.render('register');
});

app.get('/login', (req, res) => { // get Login page
  res.render('login');
});