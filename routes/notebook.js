const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notebook = require('../models/notebook');
const Note = require('../models/note');

// GET request for getting all notebooks
router.get('/', auth, (req, res) => {
  Notebook.find({ 'userId': req.userId }).exec((err, notebooks) => {
    if (err) { return res.sendStatus(500); }
    // returns list of all notebooks matching userId
    res.status(200).json({ notebooks });
  });
});

// POST request for creating new notebook
router.post('/', auth, (req, res) => {
  const notebook = new Notebook({ title: req.body.title, userId: req.userId, default: false });
  notebook.save((err, result) => {
    if (err) { return res.sendStatus(500); }
    // returns id of new notebook
    res.status(200).json({ notebookId: result._id });
  });
});

// PUT request for editing notebook
router.put('/:id', auth, (req, res) => {
  // create new notebook w same id so is updated
  const notebook = new Notebook({ title: req.body.title, default: req.body.default, userId: req.userId, _id: req.params.id });
  Notebook.findByIdAndUpdate(req.params.id, notebook, {}, (err, result) => {
    if (err) { return res.sendStatus(500); }
    res.sendStatus(200);
  });
});

// PUT request for setting default notebook
router.put('/setDefault/:id', auth, (req, res) => {
  // create new notebook w same id so is updated
  const notebook = new Notebook({ title: req.body.title, default: req.body.default, userId: req.userId, _id: req.params.id });
  Notebook.findByIdAndUpdate(req.params.id, notebook, {}, (err, result) => {
    if (err) { return res.sendStatus(500); }
    Notebook.updateMany({ $and: [{ userId: req.userId }, { _id: { $ne: req.params.id } }]}, { $set: { default: false }}, error => {
      if (error) { return res.sendStatus(500); }
      res.sendStatus(200);
    });
  });
});

// DELETE request for deleting notebook
router.delete('/:id', auth, (req, res) => {
  Notebook.findByIdAndRemove(req.params.id, err => {
    if (err) { return res.sendStatus(500); }
    // update all notes w matching notebookId to have trash set to true
    Note.updateMany({ notebookId: req.params.id }, { $set: { trash: true } }, error => {
      if (error) { return res.sendStatus(500); }
      res.sendStatus(200);
    });
  });
});

module.exports = router;
