const readerControllers = require('./controllers/readers');
const express = require('express');
const app = express();
app.use(express.json());

app.post('/readers', readerControllers.create);

app.get('/readers', readerControllers.list);

app.get('/readers/:id', readerControllers.getReaderById);

app.patch('/readers/:id', readerControllers.update);

app.delete('/readers/:id', readerControllers.destroy);

module.exports = app;