const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const config = require('config');

router.post('/login',
  [body('email').isEmail().escape(),
  body('password').not().isEmpty().trim().escape()],
  async (req, res) => {
    if (!validationResult(req).isEmpty()) {
      return res.status(400).json({ msg: 'Error in input fields.' });
    }
    try {
      const user = await User.findOne({ email: req.body.email });
      // couldn't find username in DB
      if (!user) { return res.status(400).json({ msg: 'Incorrect email or password.'}); }
      // compare encrypted pass w received pass
      const resp = await bcryptjs.compare(req.body.password, user.password);
      if (!resp) { return res.status(400).json({ msg: 'Incorrect email or password.'}); }
      const token = await jwt.sign({ user }, config.get('AUTH_KEY'));
      res.status(200).json({ token });
    } catch(e) {
      res.status(500).json({ msg: 'There was an error logging in.' });
    }
});

router.post('/signup',
  [body('email').isEmail().escape(),
  body('password').trim().isLength({ min: 7, max: 70 }).escape(),
  body('confirmPassword').trim().isLength({ min: 7, max: 70 }).escape(),
  // make sure password and confirmPassword are equal
  body('confirmPassword').custom((value, { req }) => value === req.body.password)],
  async (req, res) => {
    if (!validationResult(req).isEmpty()) {
      return res.status(400).json({ msg: 'Error in input fields.' });
    }
    try {
      const taken = await User.findOne({ email: req.body.email });
      if (taken) { return res.status(400).json({ msg: 'Email is already taken.' }); }
      // encrypt password
      const hashedPass = await bcryptjs.hash(req.body.password, 10);
      const user = new User({ email: req.body.email, password: hashedPass });
      await user.save();
      // signup successful, auto login
      const options = req.body.remember === 'false' ? { expiresIn: '3h' } : { expiresIn: '7d' };
      const token = await jwt.sign({ user }, config.get('AUTH_KEY'), options);
      res.status(200).json({ token });
    } catch(e) {
      res.status(500).json({ msg: 'There was an error signing up.' });
    }
});

module.exports = router;
