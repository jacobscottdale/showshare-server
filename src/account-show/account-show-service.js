const config = require('../config');

const AccountShowService = {
  getUserShows(db, user_id) {
    return db
      .from('account_has_show')
      .select('trakt_id', 'watch_status')
      .where('user_id', user_id)
  },

  getShowDetails(db, shows) {
    const showDetails = shows.map(show => {
      const details = db
        .from('show')
        .select('*')
        .where('trakt_id', show.trakt_id)
        .first();

      details.watch_status = show.watch_status;
      return details;

    });
    console.log(showDetails)
    return showDetails
  }
};

module.exports = AccountShowService;