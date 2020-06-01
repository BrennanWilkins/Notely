const express = require('express');
const router = express.Router();
const notebookController = require('../controllers/notebookController');
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

// // GET request for getting all notebooks
// router.get('/:userId', verifyToken, notebookController.getNotebooks);
//
// // POST request for creating new notebook
// router.post('/', verifyToken, notebookController.createNotebook);
//
// // PUT request for editing notebook
// router.put('/:id', verifyToken, notebookController.updateNotebook);
// 
// // PUT request for setting default notebook
// router.put('/setDefault/:id', verifyToken, notebookController.setDefaultNotebook);
//
// // DELETE request for deleting notebook
// router.delete('/:id', verifyToken, notebookController.deleteNotebook);

// GET request for getting all notebooks
router.get('/:userId', auth, notebookController.getNotebooks);

// POST request for creating new notebook
router.post('/', auth, notebookController.createNotebook);

// PUT request for editing notebook
router.put('/:id', auth, notebookController.updateNotebook);

// PUT request for setting default notebook
router.put('/setDefault/:id', auth, notebookController.setDefaultNotebook);

// DELETE request for deleting notebook
router.delete('/:id', auth, notebookController.deleteNotebook);

module.exports = router;
