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
mongoose.connect(config.get('DB_URL'), { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(express.json({ extended: false }));

// add routes to middleware chain
app.use('/auth', authRouter);
app.use('/notes', noteRouter);
app.use('/notebooks', notebookRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build' 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
