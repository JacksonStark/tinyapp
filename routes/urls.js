const express = require('express');

module.exports = (users, urlsForUser, urlDatabase, defaultTemplateVars, generateRandomString) => {
  
  const router = express.Router();
  
  // GET REQUESTS

  router.get('/', (req, res) => { // get urls index page
    const templateVars = {};
    console.log(users);
    if (req.session.user) {
      const userURLS = urlsForUser(req.session.user.id);
      templateVars.loggedIn = true;
      templateVars.user = req.session.user;
      templateVars.urls = userURLS;
    }
    
    return res.render('urls_index', {...defaultTemplateVars, ...templateVars});
  });
  
  router.get('/new', (req, res) => { // get Create New URl page
    if (!req.session.user) {
      return res.redirect('/login');
    }
    let templateVars = { user: req.session.user };
    res.render('urls_new', templateVars);
  });
  
  router.get('/:shortURL', (req, res) => { // shows the urls_show page
    let shortURL = req.params.shortURL;
    let templateVars = {loggedIn: false, shortURL: shortURL, longURL: urlDatabase[shortURL].longURL};
    
    if (req.session.user) {
      const userURLS = urlsForUser(req.session.user.id);
      
      if (typeof userURLS[shortURL] !== undefined) {
        templateVars.loggedIn = true;
        templateVars.user = req.session.user;
        res.render('urls_show', templateVars);
      }
    }
    
    
    res.render('urls_show', templateVars);
  });

  router.get('/redirect/:shortURL', (req, res) => { // redirect to long url when short is clicked
    const destination = urlDatabase[req.params.shortURL];
  
    if (destination) {
      res.redirect(destination.longURL);
    } else {
      res.status(404);
      let templateVars = { statusCode: res.statusCode, message: 'Invalid URL'};
      res.render('error', templateVars);
    }
  });

  // POST REQUESTS

  router.post('/', (req, res) => { // creates short url and links there
    let newShortUrl = generateRandomString();
    urlDatabase[newShortUrl] = {longURL: req.body.longURL, userID: req.session.user.id};
    res.redirect(`/urls/${newShortUrl}`);
  });
  
  router.post('/:shortURL/delete', (req, res) => { // deletes url and refreshes
  
    if (req.session.user) { // check if user is logged in
      const userURLS = urlsForUser(req.session.user.id);
  
      if (userURLS[req.params.shortURL]) { // check if shortURL is in the userID object
        delete urlDatabase[req.params.shortURL]; // THEN it may delete it from the database
        res.redirect('/urls');
      }
    }
  
    // Send error if they are not logged in
    res.status(401);
    res.send('\n 401 ERROR: \n\n You must be logged in to make deletions! \n\n');
  
  });
  
  router.post('/:shortURL/edit', (req, res) => { // modifies existing url and refreshes
    const shortURL = req.params.shortURL;
    urlDatabase[req.params.shortURL].longURL = req.body.newLongURL;
    console.log(urlDatabase, req.body.newLongURL);
    res.redirect(`/urls/${shortURL}`);
  });
  
  return router;
};
