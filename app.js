const express = require('express');
const path = require('path');
const cors = require('cors');
const config = require('config');

const authRouter = require('./routes/auth');
const noteRouter = require('./routes/note');
const notebookRouter = require('./routes/notebook');

const app = express();

// setup mongoDB connection
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
} else {
  mongoose.connect(config.get('DB_URL'), { useNewUrlParser: true, useUnifiedTopology: true });
}
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(express.json({ extended: false }));

// add routes to middleware chain
app.use('/api/auth', authRouter);
app.use('/api/notes', noteRouter);
app.use('/api/notebooks', notebookRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
