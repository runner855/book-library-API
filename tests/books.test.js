const { expect } = require("chai");
const request = require("supertest");
const { Book } = require("../src/models");
const app = require("../src/app");

describe("/books", () => {
  before(async () => Book.sequelize.sync());

  describe("with no records in the database", () => {
    describe("POST /books", () => {
      it("creates a new book in the database", async () => {
        const response = await request(app).post("/books").send({
          title: "A Promised Land",
          author: "Barack Obama",
          genre: "Biography",
          ISBN: "123444",
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal("A Promised Land");
        expect(newBookRecord.title).to.equal("A Promised Land");
        expect(newBookRecord.author).to.equal("Barack Obama");
        expect(newBookRecord.genre).to.equal("Biography");
        expect(newBookRecord.ISBN).to.equal("123444");
      });

      it("can't create the book if there are no author", async () => {
        const response = await request(app).post("/books").send({
          title: "My book",
          author: " ",
          genre: "Thriller",
          ISBN: "33556667",
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal("You need to insert the book author" );
        expect(newBookRecord).to.equal(null);
      });
      it("can't create the book if there are no title", async () => {
        const response = await request(app).post("/books").send({
          title: " ",
          author: "John Grisham",
          genre: "Spy",
          ISBN: "33998856",

        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal(
          "You need to insert the book title"
        );
        expect(newBookRecord).to.equal(null);
      });
    });
  });
});

describe("with no records in the database", () => {
  let books;

  beforeEach(async () => {
    await Book.destroy({ where: {} });

    books = await Promise.all([
      Book.create({
        title: "Joe Biden: American Dreamer",
        author: "Evan Osnos",
        genre: "Politics",
        ISBN: "145678",
      }),
      Book.create({
        title: "The Truths We Hold: An American Journey",
        author: "Kamala Harris",
        genre: "Politics",
        ISBN: "457768",
      }),
      Book.create({
        title: "Gino's Italian Escape",
        author: "Gino D'Acampo",
        genre: "Cooking",
        ISBN: "9904564",
      }),
    ]);
  });

  describe("GET /books", () => {
    it("gets all the books", async () => {
      const response = await request(app).get("/books");

      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(3);

      response.body.forEach((book) => {
        const expected = books.find((a) => a.id === book.id);

        expect(book.title).to.equal(expected.title);
        expect(book.author).to.equal(expected.author);
        expect(book.genre).to.equal(expected.genre);
        expect(book.ISBN).to.equal(expected.ISBN);
      });
    });
  });

  describe("GET /books/:id", () => {
    it("gets books record by id", async () => {
      const book = books[0];
      const response = await request(app).get(`/books/${book.id}`);

      expect(response.status).to.equal(200);
      expect(response.body.title).to.equal(book.title);
      expect(response.body.author).to.equal(book.author);
    });

    it("returns 404 if the book does not exist", async () => {
      const response = await request(app).get("/books/12345");

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal("The book could not be found.");
    });
  });

  describe("PATCH /books/:id", () => {
    it("updates the book genre by id", async () => {
      const book = books[0];
      const response = await request(app)
        .patch(`/books/${book.id}`)
        .send({ genre: "Politics" });
      const updatedBookRecord = await Book.findByPk(book.id, {
        raw: true,
      });
      expect(response.status).to.equal(204);
      expect(updatedBookRecord.genre).to.equal("Politics");

    });

    it("returns 404 if the book does not exist", async () => {
      const response = await request(app).patch("/books/12345");
        
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal("The book does not exist");

    });
  });

  describe("DELETE /books/:id", () => {
    it("delete books record by id", async () => {
      const book = books[0];
      const response = await request(app).delete(`/books/${book.id}`);
      const deletedBook = await Book.findByPk(book.id, { raw: true });

      expect(response.status).to.equal(200);
      expect(deletedBook).to.equal(null);
    });

    it("returns 404 if the book does not exist", async () => {
      const response = await request(app).delete("/books/12345");

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal("The book could not be found.");
    });
  });
});

