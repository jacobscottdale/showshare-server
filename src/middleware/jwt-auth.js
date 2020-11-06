const AuthService = require('../auth/auth-service');
const jwt = require('jsonwebtoken');
const config = require('../config');


function requireAuth(req, res, next) {
  console.log('1');
  const authToken = req.get('Authorization') || '';

  let bearerToken;
  if (!authToken.toLowerCase().startsWith('bearer')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }

  try {
    console.log('2');
    jwt.verify(bearerToken, config.JWT_SECRET, function (error, payload) {
      console.log('3');
      console.log(payload);
      AuthService.getUserWithUsername(
        req.app.get('db'),
        payload.sub,
      )
        .then(user => {
          console.log('4');
          if (!user)
            return res.status(401).json({ error: 'Unauthorized request' });
          req.user = user;
          next();
        })
        .catch(err => {
          console.log('5');
          console.error(err);
          next(err);
        });
    });

  } catch (error) {
    console.log('6');
    res.status(401).json({ error: 'Unauthorized request' });
  }


}

module.exports = {
  requireAuth,
};