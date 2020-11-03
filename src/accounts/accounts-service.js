const AccountsService = {
  getAllAccounts(knex) {
    return knex.select('*').from('accounts');
  },

  createAccount(knex, newAccount) {
    return knex
      .insert(newAccount)
      .into('accounts')
      .returning('*')
      .then(rows => rows[0])
  },

  getById(knex, id) {
    return knex.from('accounts').select('*').where('user_id', id).first();
  },
}

module.exports = AccountsService