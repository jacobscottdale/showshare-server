const xss = require('xss')
const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const AccountsService = {
  getAllAccounts(db) {
    return db.select('*').from('accounts');
  },

  createAccount(db, newAccount) {
    return db
      .insert(newAccount)
      .into('accounts')
      .returning('*')
      .then(([user]) => user);
  },

  getById(db, id) {
    return db.from('accounts').select('*').where('user_id', id).first();
  },

  deleteAccount(db, id) {
    return db('accounts')
      .where({ 'user_id': id })
      .delete();
  },

  updateAccount(db, id, newAccountFields) {
    return db('accounts')
      .where({ id })
      .update(newAccountFields);
  },

  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password must be fewer than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must must not start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain at least 1 upper case, lower case, number and special character'
    }
    return null
  },

  usernameInUse(db, username) {
    return db('accounts')
      .where({ username })
      .first()
      .then(user => !!user)
  },

  serializeAccount(account) {
    return {
      user_id: account.user_id,
      first_name: account.first_name,
      last_name: account.last_name,
      username: account.username,
      date_created: new Date(account.created_on),
    }
  },

  hashPassword(password) {
    return bcrypt.hash(password, 10)
  },
};

module.exports = AccountsService;