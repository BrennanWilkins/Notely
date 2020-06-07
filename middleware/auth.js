const jwt = require('jsonwebtoken');
const config = require('config');

// verify jwt token from user
module.exports = (req, res, next) => {
  const reqToken = req.header('x-auth-token');
  if (reqToken) {
    if (process.env.NODE_ENV === 'production') {
      jwt.verify(reqToken, process.env.AUTH_KEY, (err, token) => {
        if (err) {
          return res.status(401).json({ msg: 'Token is not valid.', token });
        }
        req.token = reqToken;
        next();
      });
    } else {
      jwt.verify(reqToken, config.get('AUTH_KEY'), (err, token) => {
        if (err) {
          return res.status(401).json({ msg: 'Token is not valid.', token });
        }
        req.token = reqToken;
        next();
      });
    }
  } else {
    res.status(401).json({ msg: 'No token was received.' });
  }
};
