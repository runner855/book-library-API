const { expect } = require("chai");
const request = require("supertest");
const { Reader } = require("../src/models");
const app = require("../src/app");

describe("/readers", () => {
  before(async () => {
    try {
      await Reader.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Reader.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });

  describe("POST /readers", async () => {
    it("creates a new reader in the database", async () => {
      const response = await request(app).post("/readers").send({
        name: "John",
        email: "john@iamareader.com",
      });

      await expect(response.status).to.equal(201);
      expect(response.body.name).to.equal("John");

      const insertedReaderRecords = await Reader.findByPk(response.body.id, {
        raw: true,
        
      });
      expect(res.body.name).to.equal("John");
      expect(res.body.email).to.equal("john@iamareader.com");
    });
  });

  describe("with readers in the database", () => {
    let readers;
    beforeEach((done) => {
      Promise.all([
        Reader.create({ name: "John", email: "john@iamareader.com" }),
        Reader.create({ name: "Laura", email: "laura@iamlaura.com" }),
        Reader.create({ name: "Tom", email: "tom@imnotuncletom.com" }),
      ]).then((documents) => {
        readers = documents;
        done();
      });
    });
  });
});
