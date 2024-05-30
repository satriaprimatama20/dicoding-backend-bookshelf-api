// app.js

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 9000;

app.use(bodyParser.json());

let books = [];

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API routes
app.get("/books", (req, res) => {
  let result = books;

  // Filter by name
  if (req.query.name) {
    const nameQuery = req.query.name.toLowerCase();
    result = result.filter((book) =>
      book.name.toLowerCase().includes(nameQuery)
    );
  }

  // Filter by reading status
  if (req.query.reading !== undefined) {
    const readingStatus = req.query.reading === "1";
    result = result.filter((book) => book.reading === readingStatus);
  }

  // Filter by finished status
  if (req.query.finished !== undefined) {
    const finishedStatus = req.query.finished === "1";
    result = result.filter((book) => book.finished === finishedStatus);
  }

  res.json(result);
});

app.post("/books", (req, res) => {
  const newBook = req.body;
  books.push(newBook);
  res.status(201).json(newBook);
});

app.get("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find((book) => book.id === bookId);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

app.put("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const updatedBook = req.body;
  books = books.map((book) =>
    book.id === bookId ? { ...book, ...updatedBook } : book
  );
  res.json(updatedBook);
});

app.delete("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  books = books.filter((book) => book.id !== bookId);
  res.status(204).end();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
