const config = require('../config');

const AccountShowService = {
  getUserShows(db, user_id) {
    return db
      .from('account_has_show')
      .select('trakt_id', 'watch_status')
      .where('user_id', user_id)
  },

  getShowDetails(db, show) {
    return db
        .from('show')
        .select('*')
        .where('trakt_id', show.trakt_id)
        .first()
        .then(showDetail => {
          return {
            ...showDetail,
            watch_status: show.watch_status
          }
        });
  }
};

module.exports = AccountShowService;