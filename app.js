require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const usersRouter = require('./routers/usersRoutes');
require('./db-connection.js');

const defaultPort = 3001;
const port = process.env.PORT || defaultPort;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (error, req, res, next) {
  console.log(error);
  res.status(404).json({ message: 'Not found' });
});

app.listen(port, () => console.log(`Server run on http://localhost:${port}`));
