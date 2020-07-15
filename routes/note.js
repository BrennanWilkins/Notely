const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/note');

// GET request for getting all user notes
router.get('/', auth, (req, res) => {
  Note.find({ 'userId': req.userId }).exec((err, notes) => {
    if (err) { return res.sendStatus(500); }
    // returns list of all notes matching userId
    res.status(200).json({ notes });
  });
});

// POST request for creating new note
router.post('/', auth, (req, res) => {
  // new note must get _id of its notebook and the user
  const note = new Note({ title: req.body.title, body: req.body.body, favorite: false, trash: false,
    dateCreated: req.body.dateCreated, date: req.body.date, userId: req.userId, notebookId: req.body.notebookId });
  note.save((err, result) => {
    if (err) { return res.sendStatus(500); }
    // returns id of new note
    res.status(200).json({ noteId: result._id });
  });
});

// PUT request for editing a note
router.put('/:id', auth, (req, res) => {
  // create new note w same id so is updated
  const note = new Note({ title: req.body.title, body: req.body.body, favorite: req.body.favorite, _id: req.params.id,
    trash: req.body.trash, dateCreated: req.body.dateCreated, date: req.body.date, userId: req.userId,
    notebookId: req.body.notebookId });
  Note.findByIdAndUpdate(req.params.id, note, {}, (err, result) => {
    if (err) { return res.sendStatus(500); }
    res.sendStatus(200);
  });
});

// DELETE request for deleting note
router.delete('/:id', auth, (req, res) => {
  Note.findByIdAndRemove(req.params.id, err => {
    if (err) { return res.sendStatus(500); }
    res.sendStatus(200);
  });
});

module.exports = router;
