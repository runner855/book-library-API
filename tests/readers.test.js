const { expect } = require("chai");
const request = require("supertest");
const { Reader } = require("../src/models");
const app = require("../src/app");

describe("/readers", () => {
  before(async () => Reader.sequelize.sync());

  describe("with no records in the database", () => {
    describe("POST /readers",  () => {
      it("creates a new reader in the database", async () => {
        const response = await request(app).post("/readers").send({
          name: "John",
          email: "john@iamareader.com",
          password: "password",
        });
        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal("John");
        expect(response.body.email).to.equal("john@iamareader.com");
        expect(response.body.password).to.equal(undefined);



        expect(newReaderRecord.name).to.equal("John");
        expect(newReaderRecord.email).to.equal("john@iamareader.com");
        expect(newReaderRecord.password).to.equal("password");
      });

      it("errors if  password is not at least characters long", async () => {
        const response = await request(app).post("/readers").send({
          name: "Elizabeth Bennet",
          email: "future_ms@darcygmail.com",
          password: "13",
        });
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal(
          "Your password must be at least 8 characters long"
        );
      });

      it("errors if  email is not in the correct format", async () => {
        const response = await request(app).post("/readers").send({
          name: "Elizabeth Bennet",
          email: "future_msdarcygmail.com",
          password: "133456678",
        });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("This is not a valid email");
      });

      it("you need to add your password", async () => {
        const response = await request(app).post("/readers").send({
          name: "Josh",
          password: "",
          email: "email@domain.com",
        });
        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Your password must be at least 8 characters long");
        expect(newReaderRecord).to.equal(null);
      });
    
  
      it("you need to add your name", async () => {
        const response = await request(app).post("/readers").send({
          name: "",
          password: "12345667895678",
          email: "email@domain.com",
        });
        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Cannot be empty");
        expect(newReaderRecord).to.equal(null);
      });
    });
  });

  describe("with readers in the database", () => {
    let readers;

    beforeEach(async () => {
      await Reader.destroy({ where: {} });

      readers = await Promise.all([
        Reader.create({
          name: "John",
          email: "john@iamareader.com",
          password: "secretooh",
        }),
        Reader.create({
          name: "Laura",
          email: "laura@iamlaura.com",
          password: "supersecret",
        }),
        Reader.create({
          name: "Tom",
          email: "tom@imnotuncletom.com",
          password: "verysecret",
        }),
      ]);
    });

    describe("GET /readers", () => {
      it("gets all readers records", async () => {
        const response = await request(app).get("/readers");

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((reader) => {
          const expected = readers.find((a) => a.id === reader.id);

          expect(reader.name).to.equal(expected.name);
          expect(reader.email).to.equal(expected.email);
          expect(reader.password).to.equal(undefined);

        });
      });
    });

    describe("GET /readers/:id", () => {
      it("gets readers by id", async () => {
        const reader = readers[0];
        const response = await request(app).get(`/readers/${reader.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(reader.name);
        expect(response.body.email).to.equal(reader.email);
        expect(response.body.password).to.equal(undefined);

      });

      it("returns a 404 if the reader does not exist", async () => {
        const response = await request(app).get("/readers/12345");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The reader could not be found");
      });
    });

    describe("PATCH /readers/:id", () => {
      it("updates readers email by id", async () => {
        const reader = readers[0];
        const response = await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ email: "paul@thisismyemail.com" });
        const updatedReader = await Reader.findByPk(reader.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedReader.email).to.equal("paul@thisismyemail.com");
      });

      it("returns 404 if the reader does not exist", async () => {
        const response = await request(app)
          .patch("/readers/12345")
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The reader could not be found");
      });
    });

    describe("DELETE /readers/:id", () => {
      it("deletes readers by id", async () => {
        const reader = readers[0];
        const response = await request(app).delete(`/readers/${reader.id}`);
        const deletedReader = await Reader.findByPk(reader.id, { raw: true });

        expect(response.status).to.equal(200);
        expect(deletedReader).to.equal(null);
      });

      it("returns 404 if the reader does not exist", async () => {
        const response = await request(app)
        .delete("/readers/12345")

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The reader could not be found");
      });
    });
  });
});
