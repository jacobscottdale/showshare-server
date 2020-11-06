const AccountsService = {
  getAllAccounts(knex) {
    return knex.select('*').from('accounts');
  },

  createAccount(knex, newAccount) {
    return knex
      .insert(newAccount)
      .into('accounts')
      .returning('*')
      .then(rows => rows[0]);
  },

  getById(knex, id) {
    return knex.from('accounts').select('*').where('user_id', id).first();
  },

  deleteAccount(knex, id) {
    return knex('accounts')
      .where({ 'user_id': id })
      .delete();
  },

  updateAccount(knex, id, newAccountFields) {
    return knex('accounts')
      .where({ id })
      .update(newAccountFields);
  },
};

module.exports = AccountsService;