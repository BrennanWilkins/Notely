const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {type: String, required: true},
  body: {type: String, required: true},
  favorite: {type: Boolean, required: true},
  trash: {type: Boolean, required: true},
  dateCreated: {type: String, required: true},
  date: {type: String, required: true},
  notebookId: {type: mongoose.Schema.Types.ObjectId, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true}
});

module.exports = mongoose.model('Note', NoteSchema);
