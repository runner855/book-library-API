const readerControllers = require('./controllers/readers');
const bookControllers = require('./controllers/books')
const express = require('express');
const app = express();
app.use(express.json());

app.post('/readers', readerControllers.create);

app.get('/readers', readerControllers.list);

app.get('/readers/:id', readerControllers.getReaderById);

app.patch('/readers/:id', readerControllers.update);

app.delete('/readers/:id', readerControllers.destroy);

app.post('/readers/:readerId/books', bookControllers.create);

app.get('/books', bookControllers.list);

app.patch('/books/:id', bookControllers.update);

app.delete('/books/:id', bookControllers.destroy);


module.exports = app;