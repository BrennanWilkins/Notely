const jwt = require('jsonwebtoken');
const config = require('config');

// verify jwt token from user
module.exports = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  //format of token: Authorization: Bearer <token>
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, config.get('AUTH_KEY'), (err, token) => {
      if (err) {
        return res.status(401).json({ msg: 'Token is not valid.' });
      }
      req.token = bearerToken;
      next();
    });
  } else {
    res.status(401).json({ msg: 'No token was received.' });
  }
};
