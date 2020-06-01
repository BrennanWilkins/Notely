const mongoose = require('mongoose');

const NotebookSchema = new mongoose.Schema({
  title: {type: String, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  default: {type: Boolean, required: true}
});

module.exports = mongoose.model('Notebook', NotebookSchema);
