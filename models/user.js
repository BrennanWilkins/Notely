const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {type: String, required: true, max: 70},
  password: {type: String, required: true, max: 70, min: 7}
});

module.exports = mongoose.model('User', UserSchema);
