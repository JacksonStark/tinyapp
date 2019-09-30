const express = require('express');
const app = express();
const PORT = 8080;

const urlDatabase = {
  'b2xVn2': 'http://www.;ighthouselsbd.ca',
  '9sm5zK': 'http://www.google.com'
};

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});