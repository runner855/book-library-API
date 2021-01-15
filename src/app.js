const readerControllers = require('./controllers/readers');
const express = require('express');
const app = express();
app.use(express.json());

app.post('/readers', readerControllers.create);

module.exports = app;