const { expect } = require("chai");
const request = require("supertest");
const { Genre } = require("../src/models");
const app = require("../src/app");

describe("/genres", () => {
  before(async () => Genre.sequelize.sync());

  describe("with no records in the database", () => {
    describe("POST /genres", () => {
      it("creates a new genre in the database", async () => {
        const response = await request(app).post("/genres").send({
          genre: "Biography",
        });
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.genre).to.equal("Biography");
        expect(newGenreRecord.genre).to.equal("Biography");
      });
    });
  });

  describe("with no records in the database", () => {
    let genres;

    beforeEach(async () => {
      await Genre.destroy({ where: {} });

      genres = await Promise.all([
      Genre.create({
          genre: "Politics",
        }),
        Genre.create({
          genre: "Politics",
        }),
        Genre.create({
          name: "Cooking",
        }),
      ]);
    });

    describe("GET /genres", () => {
      it("gets all the genres", async () => {
        const response = await request(app).get("/genres");
        

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((genre) => {
          const expected = genres.find((a) => a.id === genre.id);

          expect(genre.genre).to.equal(expected.genre);
        });
      });
    });

    describe("GET /genres/:id", () => {
      it("gets genres  by id", async () => {
        const genre = genres[0];
        const response = await request(app).get(`/genres/${genre.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.genre).to.equal(genre.genre);
      });

      it("returns 404 if the genre does not exist", async () => {
        const response = await request(app).get("/genres/12345");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The genre could not be found.");
      });
    });

    describe("PATCH /genres/:id", () => {
      it("updates the genre  by id", async () => {
        const genre = genres[0];
        const response = await request(app)
          .patch(`/genres/${genre.id}`)
          .send({ genre: "Horror" });
        const updatedGenreRecord = await Genre.findByPk(genre.id, {
          raw: true,
        });
        expect(response.status).to.equal(200);
        expect(updatedGenreRecord.genre).to.equal("Horror");
      });

      it("returns 404 if the genre does not exist", async () => {
        const response = await request(app).patch("/genres/12345").send({
        genre: "Romance",
        });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The genre could not be found.");
      });
    });

    describe("DELETE /genres/:id", () => {
      it("delete genres record by id", async () => {
        const genre = genres[0];
        const response = await request(app).delete(`/genres/${genre.id}`);
        const deletedGenre = await Genre.findByPk(genre.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedGenre).to.equal(null);
      });

      it("returns 404 if the genre does not exist", async () => {
        const response = await request(app).delete("/genres/12345");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The genre could not be found.");
      });
    });
  });
});
