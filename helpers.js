const emailLookup = (email, users) => { // checks if email is in database
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return false;
}

module.exports = { emailLookup }