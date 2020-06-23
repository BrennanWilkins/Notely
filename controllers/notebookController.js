const jwt = require('jsonwebtoken');
const Notebook = require('../models/notebook');
const Note = require('../models/note');

// get all notebooks
exports.getNotebooks = (req, res, next) => {
  Notebook.find({ 'userId' : req.userId }).exec((err, notebooks) => {
    if (err) { return res.status(500).json({ msg: 'Error getting notebooks from server.' }); }
    // returns list of all notebooks matching userId
    return res.status(200).json({ msg: 'Success.', notebooks });
  });
};

// create a new notebook
exports.createNotebook = (req, res, next) => {
  const notebook = new Notebook({ title: req.body.title, userId: req.userId, default: false });
  notebook.save((err, result) => {
    if (err) { return res.status(500).json({ msg: 'Failed to create new notebook.' }); }
    // returns id of new notebook
    return res.status(200).json({ msg: 'Success.', notebookId: result._id });
  });
};

// update a notebook
exports.updateNotebook = (req, res, next) => {
  // create new notebook w same id so is updated
  const notebook = new Notebook({ title: req.body.title, default: req.body.default, userId: req.userId, _id: req.params.id });
  Notebook.findByIdAndUpdate(req.params.id, notebook, {}, (err, result) => {
    if (err) { return res.status(500).json({ msg: 'Failed to update notebook.' }); }
    return res.status(200).json({ msg: 'Success.' });
  });
};

// sets default to true for default notebook & updates all others to false
exports.setDefaultNotebook = (req, res, next) => {
  // create new notebook w same id so is updated
  const notebook = new Notebook({ title: req.body.title, default: req.body.default, userId: req.userId, _id: req.params.id });
  Notebook.findByIdAndUpdate(req.params.id, notebook, {}, (err, result) => {
    if (err) { return res.status(500).json({ msg: 'Failed to update notebook.' }); }
    Notebook.updateMany({ $and: [{ userId: req.userId }, { _id: { $ne: req.params.id } }]}, { $set: { default: false }}, error => {
      if (err) { return res.status(500).json({ msg: 'Failed to update notebook.' }); }
      return res.status(200).json({ msg: 'Success.' });
    });
  });
}

// delete a notebook & all notes w matching notebookId
exports.deleteNotebook = (req, res, next) => {
  Notebook.findByIdAndRemove(req.params.id, err => {
    if (err) { return res.status(500).json({ msg: 'Failed to delete notebook.' }); }
    // update all notes w matching notebookId to have trash set to true
    Note.updateMany({ notebookId: req.params.id }, { $set: { trash: true } }, error => {
      if (error) { return res.status(500).json({ msg: 'Failed to delete notebook.' }); }
      return res.status(200).json({ msg: 'Success.' });
    });
  });
};
