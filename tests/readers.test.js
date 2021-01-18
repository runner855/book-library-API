const { expect } = require("chai");
const request = require("supertest");
const { Reader } = require("../src/models");
const app = require("../src/app");

describe("/readers", () => {
  before(async () =>  {
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
        password: "password",
      });

      await expect(response.status).to.equal(201);
      expect(response.body.name).to.equal("John");

      const insertedReaderRecords = await Reader.findByPk(response.body.id, {
        raw: true,
      });
      expect(insertedReaderRecords.name).to.equal("John");
      expect(insertedReaderRecords.email).to.equal("john@iamareader.com");
      expect(insertedReaderRecords.password).to.equal("password");

    });
  });




  describe("with readers in the database", () => {
    let readers;
    beforeEach((done) => {
      Promise.all([
        Reader.create({ name: "John", email: "john@iamareader.com", password: "secret" }),
        Reader.create({ name: "Laura", email: "laura@iamlaura.com", password: "supersecret" }),
        Reader.create({ name: "Tom", email: "tom@imnotuncletom.com", password: "verysecret" }),
      ]).then((documents) => {
        readers = documents;
        done();
      });
    });
    describe("GET /readers", () => {
      it("gets all readers records", (done) => {
        request(app)
        .get("/readers")
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(3);
          res.body.forEach((reader) => {
            const expected = readers.find((a) => a.id === reader.id);
            expect(reader.name).to.equal(expected.name);
            expect(reader.email).to.equal(expected.email);
            expect(reader.password).to.equal(expected.password);

          })
          done();
        })
      })

      describe("GET /readers/:id", () => {
        it('gets readers by id', (done) => {
          const reader = readers[0];
          request(app)
            .get(`/readers/${reader.id}`)
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(res.body.name).to.equal(reader.name);
              expect(res.body.email).to.equal(reader.email);
              expect(res.body.password).to.equal(reader.password);

              done();
        }).catch(error => done(error));
      })
    });
      describe("PATCH /readers/:id", () => {
        it("updates readers name by id", (done) => {
          const reader = readers[0];
          request(app)
          .patch(`/readers/${reader.id}`)
          .send({ name: "Paul" })
          .then((res) => {
            expect(res.status).to.equal(200);
            Reader.findByPk(reader.id, { raw: true }).then(
              (updatedReader) => {
                expect(updatedReader.name).to.equal("Paul");
                done();
              }
            )
          })
        })
        describe("DELETE /readers/:id", () => {
          it("deletes readers by id", (done) => {
            const reader = readers[0];
            request(app)
            .delete(`/readers/${reader.id}`)
            .then((res) => {
              expect(res.status).to.equal(204);
              Reader.findByPk(reader.id, { raw: true }).then((deletedReader) => {
                expect(deletedReader).to.equal(null);
                done();
              })

            })
          })
        })
      })
    })
  });
});
