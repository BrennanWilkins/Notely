const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const auth = require('../middleware/auth');

// GET request for getting all user notes
router.get('/:userId', auth, noteController.getNotes);

// POST request for creating new note
router.post('/', auth, noteController.createNote);

// PUT request for editing a note
router.put('/:id', auth, noteController.updateNote);

// DELETE request for deleting note
router.delete('/:id', auth, noteController.deleteNote);

module.exports = router;
