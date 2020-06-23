const jwt = require('jsonwebtoken');
const Note = require('../models/note');

// get all notes
exports.getNotes = (req, res, next) => {
  Note.find({ 'userId': req.userId }).exec((err, notes) => {
    if (err) { return res.status(500).json({ msg: 'Error getting notes from server.' }); }
    // returns list of all notes matching userId
    return res.status(200).json({ msg: 'Success.', notes });
  });
};

// create a new note
exports.createNote = (req, res, next) => {
  // new note must get _id of its notebook and the user
  const note = new Note({ title: req.body.title, body: req.body.body, favorite: false, trash: false,
    dateCreated: req.body.dateCreated, date: req.body.date, userId: req.userId, notebookId: req.body.notebookId });
  note.save((err, result) => {
    if (err) { return res.status(500).json({ msg: 'Failed to create new note.' }); }
    // returns id of new note
    return res.status(200).json({ msg: 'Success.', noteId: result._id });
  });
};

// update a note
exports.updateNote = (req, res, next) => {
  // create new note w same id so is updated
  const note = new Note({ title: req.body.title, body: req.body.body, favorite: req.body.favorite, _id: req.params.id,
    trash: req.body.trash, dateCreated: req.body.dateCreated, date: req.body.date, userId: req.userId,
    notebookId: req.body.notebookId });
  Note.findByIdAndUpdate(req.params.id, note, {}, (err, result) => {
    if (err) { return res.status(500).json({ msg: 'Failed to update note.' }); }
    return res.status(200).json({ msg: 'Success.' });
  });
};

// delete a note
exports.deleteNote = (req, res, next) => {
  Note.findByIdAndRemove(req.params.id, err => {
    if (err) { return res.status(500).json({ msg: 'Failed to delete note.' }); }
    return res.status(200).json({ msg: 'Success.' });
  });
};
