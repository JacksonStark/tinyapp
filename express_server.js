const bcrypt = require('bcryptjs');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const {getUserByEmail} = require('./helpers.js');
const urlRoutes = require('./routes/urls.js');
const authenticationRoutes = require('./routes/authentication.js');
const app = express();
const PORT = 8080;

// MIDDLEWARE

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(cookieSession({
  name: 'session',
  secret: 'thisissupersecret'
}));

// SERVER LISTENING...

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// OTHER FUNCTIONS AND OBJECTS...

const users = {};

const urlsForUser = (id) => {
  let filteredUrls = {};
  if (!id) return filteredUrls;

  for (const key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      filteredUrls[key] = urlDatabase[key];
    }
  }
  return filteredUrls;
};

const urlDatabase = { // database storage
  'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', userID: 'example1' },
  '9sm5zK': { longURL: 'http://www.google.com', userID: 'example2' }
};

const defaultTemplateVars = { loggedIn: false};

const generateRandomString = () => { // creates unique id
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};


// ROUTERS MIDDLEWARE

app.use('/urls', urlRoutes(users, urlsForUser, urlDatabase, defaultTemplateVars, generateRandomString));

app.use('/', authenticationRoutes(bcrypt, users, getUserByEmail, generateRandomString));