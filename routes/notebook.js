const express = require('express');
const router = express.Router();
const notebookController = require('../controllers/notebookController');
const auth = require('../middleware/auth');

// GET request for getting all notebooks
router.get('/', auth, notebookController.getNotebooks);

// POST request for creating new notebook
router.post('/', auth, notebookController.createNotebook);

// PUT request for editing notebook
router.put('/:id', auth, notebookController.updateNotebook);

// PUT request for setting default notebook
router.put('/setDefault/:id', auth, notebookController.setDefaultNotebook);

// DELETE request for deleting notebook
router.delete('/:id', auth, notebookController.deleteNotebook);

module.exports = router;
