const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const auth = require('../middleware/auth');

// // verifies jwt token from user
// const verifyToken = (req, res, next) => {
//   // get auth header value
//   const bearerHeader = req.headers['authorization'];
//   //format of token: Authorization: Bearer <token>
//   if (typeof bearerHeader !== 'undefined') {
//     // split at the space
//     const bearer = bearerHeader.split(' ');
//     const bearerToken = bearer[1];
//     // set the token
//     req.token = bearerToken;
//     next();
//   } else {
//     res.sendStatus(403);
//   }
// };

// // GET request for getting all user notes
// router.get('/:userId', verifyToken, noteController.getNotes);
//
// // POST request for creating new note
// router.post('/', verifyToken, noteController.createNote);
//
// // PUT request for editing a note
// router.put('/:id', verifyToken, noteController.updateNote);
//
// // DELETE request for deleting note
// router.delete('/:id', verifyToken, noteController.deleteNote);

// GET request for getting all user notes
router.get('/:userId', auth, noteController.getNotes);

// POST request for creating new note
router.post('/', auth, noteController.createNote);

// PUT request for editing a note
router.put('/:id', auth, noteController.updateNote);

// DELETE request for deleting note
router.delete('/:id', auth, noteController.deleteNote);

module.exports = router;
