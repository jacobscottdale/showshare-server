const AccountsService = {
  getAllAccounts(knex) {
    return knex.select('*').from('accounts');
  },

  getById(knex, id) {
    return knex.from('accounts').select('*').where('user_id', id).first();
  },
}

module.exports = AccountsService