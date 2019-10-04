const express = require('express');

module.exports = (bcrypt, users, getUserByEmail, generateRandomString) => {
  
  const router = express.Router();

  // GET REQUESTS

  router.get('/register', (req, res) => { // get Register page
    res.render('register');
  });
  
  router.get('/login', (req, res) => { // get Login page
    res.render('login');
  });

  // POST REQUESTS

  router.post('/login', (req, res) => { // logs in and records user (cookie)
    const user = getUserByEmail(req.body.email, users);
  
    if (!user) { // Sending error if email is not in system
      res.status(403);
      let templateVars = { statusCode: res.statusCode, message: 'Email cannot be found'};
      res.render('error', templateVars);
    } else if (!bcrypt.compareSync(req.body.password, user.hashedPassword)) { // Sending error if password is incorrect
      res.status(403);
      let templateVars = { statusCode: res.statusCode, message: 'Password is incorrect'};
      res.render('error', templateVars);
    }
  
    req.session.user = user;
    res.redirect('/urls');
  });
  
  router.post('/logout', (req, res) => { // logs out and clears user (cookie)
    req.session = null;
    res.redirect('/urls');
  });
  
  router.post('/register', (req, res) => { // creates new account and user cookie, records them in database
    const user = getUserByEmail(req.body.email, users);
    const email = req.body.email;
    const password = req.body.password;
    const uID = generateRandomString();
    if (user.email === email) {
      res.status(400);
      let templateVars = { statusCode: res.statusCode, message: 'Email already in use!'};
      res.render('error', templateVars);
    } else if (!email || !password) {
      res.status(400);
      let templateVars = { statusCode: res.statusCode, message: ' Password or Email not entered!'};
      res.render('error', templateVars);
    } else {
      users[uID] = {
        id: uID,
        email: email,
        hashedPassword: bcrypt.hashSync(password, 10),
      };
      req.session.user = users[uID];
      res.redirect('/urls');
    }
  });
    
  return router;

};