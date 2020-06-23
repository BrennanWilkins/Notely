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
    if (!errors.isEmpty()) { return res.status(400).json({ msg: 'Error in input fields.' }); }
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) { return res.status(500).json({ msg: 'Error connecting to the server.' }); }
      // couldn't find username in DB
      if (!user) {
        return res.status(400).json({ msg: 'Incorrect email or password.'});
      }
      // compared encrypted password w received password
      bcryptjs.compare(req.body.password, user.password, (err, resp) => {
        if (resp) {
          // success, returns jwt token and user id
          jwt.sign({ user }, config.get('AUTH_KEY'), (err, token) => {
            return res.status(200).json({ token, msg: 'Success.' });
          });
        } else {
          // login failed
          return res.status(400).json({ msg: 'Incorrect email or password.'});
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
    if (!errors.isEmpty()) { return res.status(400).json({ msg: 'Error in input fields.' }); }
    User.find({ 'email': req.body.email }).exec((err, user) => {
      if (err) { return res.status(500).json({ msg: 'Error connecting to server.' }); }
      // username is already taken
      if (user.length != 0) {
        return res.status(400).json({ msg: 'Taken.' });
      }
      // compare encrypted password w received password
      bcryptjs.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) { return res.status(500).json({ msg: 'Failed encrypting password.' }); }
        const user = new User({ email: req.body.email, password: hashedPassword });
        user.save(error => {
          if (error) { return res.status(500).json({ msg: 'Failed signing up user.' }); }
          jwt.sign({ user }, config.get('AUTH_KEY'), (err, token) => {
            if (err) { return res.status(500).json({ msg: 'Failed signing up user.' }); }
            // user successful signed up
            return res.status(200).json({ msg: 'Success.', token });
          });
        });
      });
    });
  }
];
