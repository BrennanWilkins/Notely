const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST request for login
router.post('/login', authController.login);

// POST request for signup
router.post('/signup', authController.signup);

module.exports = router;
