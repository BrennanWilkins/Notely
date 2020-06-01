const User = require('../models/user');
const { check, body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const config = require('config');

exports.login = [
  // validate fields
  check('email').isEmail(),
  check('password').trim().isLength({ min: 6, max: 70 }),
  body('*').escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.json({ message: 'Error in input fields.' }); }
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) { return res.json({ message: 'Error connecting to the server.' }); }
      // couldn't find username in DB
      if (!user) {
        return res.json({ message: 'Incorrect email or password.'});
      }
      // compared encrypted password w received password
      bcryptjs.compare(req.body.password, user.password, (err, resp) => {
        if (resp) {
          // success, returns jwt token and user id
          jwt.sign({ user }, config.get('AUTH_KEY'), (err, token) => {
            return res.json({ token, userId: user._id, message: 'Success.' });
          });
        } else {
          // login failed
          return res.json({ message: 'Incorrect email or password.'});
        }
      });
    });
  }
];

exports.signup = [
  // validate fields
  check('email').isEmail(),
  check('password').trim().isLength({ min: 7, max: 70 }),
  check('confirmPassword').trim().isLength({ min: 7, max: 70 }),
  // make sure password and confirmed password are equal
  check('confirmPassword').custom((value, { req }) => value === req.body.password),
  body('*').escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.json({ message: 'Error in input fields.' }); }
    User.find({ 'email': req.body.email }).exec((err, user) => {
      if (err) { return res.json({ message: 'Error connecting to server.' }); }
      // username is already taken
      if (user.length != 0) {
        return res.json({ message: 'Taken.' });
      }
      // compare encrypted password w received password
      bcryptjs.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) { return res.json({ message: 'Failed encrypting password.' }); }
        const user = new User({ email: req.body.email, password: hashedPassword });
        user.save(error => {
          if (error) { return res.json({ message: 'Failed signing up user.' }); }
          // user successful signed up
          return res.json({ message: 'Success.' });
        });
      });
    });
  }
];
