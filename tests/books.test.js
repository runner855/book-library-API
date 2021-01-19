const { expect } = require("chai");
const request = require("supertest");
const { Reader, Book } = require("../src/models");
const app = require("../src/app");

describe("/books", () => {
  let reader;

  before(async () => {
    try {
      await Reader.sequelize.sync();
      await Book.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Reader.destroy({ where: {} });
      await Book.destroy({ where: {} });
      reader = await Reader.create({
        name: "John",
        email: "John@myemail.com",
        password: "password",
      });
    } catch (err) {
      console.log(err);
    }
  });

  describe("POST /readers/:readerId/books", () => {
    it("creates a new book for a given reader", () => {
      request(app)
        .post(`/readers/${reader.id}/books`)
        .send({
          title: "A Promised Land",
          author: "Barack Obama",
          genre: "Biography",
          ISBN: "123444",
        })
        .then((res) => {
          expect(res.status).to.equal(201);

          Book.findByPk(res.body.id, { raw: true })
            .then((book) => {
              expect(book.title).to.equal("A Promised Land");
              expect(book.title).to.equal("A Promised Land");
              expect(book.author).to.equal("Barack Obama");
              expect(book.genre).to.equal("Biography");
              expect(book.ISBN).to.equal("123444");
              expect(book.readerId).to.equal(reader.id);
              done();
            })
            .catch((error) => done(error));
        })
        .catch((error) => done(error));
    });

    it("returns 404 and does not create a book if the reader does not exist", () => {
      request(app)
        .post("/readers/1234/books")
        .send({
          title: "A Promised Land",
          author: "Barack Obama",
          genre: "Biography",
          ISBN: "123444",
        })
        .then((res) => {
          expect(res.status).to.equal(404);

          expect(res.body.error).to.equal("The reader could not be found");

          Book.findAll()
            .then((books) => {
              expect(books.length).to.equal(0);
              done();
            })
            .catch((error) => done(error));
        })
        .catch((error) => done(error));
    });

    describe("with books in the database", () => {
      let books;
      beforeEach((done) => {
        Promise.all([
          Book.create({
            title: "A Promise Land",
            author: "Barack Obama",
            genre: "Biography",
            ISBN: "123444",
          }),
          Book.create({
            title: "7 Ways",
            author: "Jamie Oliver",
            genre: "Cooking",
            ISBN: "124577",
          }),
          Book.create({
            title: "The Danger Gand",
            author: "Tom Fletcher",
            genre: "children's-fantasy",
            ISBN: "123444",
          }),
        ]).then((documents) => {
          books = documents;
          done();
        }).catch(error => done(error));
      });

      describe("GET /books", () => {
        it("gets all the books", () => {
          request(app)
            .get("/books")
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(res.body.length).to.equal(3);
              res.body.forEach((book) => {
                  const expected = books.find((a) => a.id === book.id);
                  expect(book.title).to.equal(expected.title);
                  expect(book.author).to.equal(expected.author);
                  expect(book.genre).to.equal(expected.genre);
                  expect(book.ISBN).to.equal(expected.ISBN);
                  done();
                })
            }).catch(error => done(error));

        });

        describe("PATCH /books/:id", () => {
          it("updates the book title by id", () => {
            const book = books[0];
            request(app)
              .patch(`/books/${book.id}`)
              .send({ title: "The American Dream" })
              .then((res) => {
                expect(res.status).to.equal(204);
                Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
                  expect(updatedBook).to.equal(null);
                  done();
                }).catch(error => done(error));
              }).catch(error => done(error));
          });
        });

          describe("DELETE /books/:bookId", () => {
            it("deletes book record by id", () => {
              const book = books[0];
              request(app)
                .delete(` /books/${book.id}`)
                .then((res) => {
                  expect(res.status).to.equal(204);
                  Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
                    expect(updatedBook).to.equal(null);
                    done;
                  });
                });
            });
          });
        });
      });
    });
  });

