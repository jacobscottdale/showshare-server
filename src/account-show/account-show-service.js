const config = require('../config');

const AccountShowService = {
  getUserShows(db, user_id) {
    return db
      .from('account_has_show')
      .select('trakt_id', 'watch_status')
      .where('user_id', user_id);
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
        };
      });
  },

  insertUserShow(db, newUserShow) {
    return db
      .insert(newUserShow)
      .into('account_has_show')
      .returning('*')
      .then(([userShow]) => userShow);
  },

  updateWatchStatus(db, userShow) {
    return db('account_has_show')
      .where({
        user_id: userShow.user_id,
        trakt_id: userShow.trakt_id
      })
      .update('watch_status', userShow.watch_status)
      .returning('*')
      .then(([userShow]) => userShow);
  },

  removeUserShow(db, userShow) {
    return db('account_has_show')
      .where({
        user_id: userShow.user_id,
        trakt_id: userShow.trakt_id
      })
      .delete();
  }
};

module.exports = AccountShowService;