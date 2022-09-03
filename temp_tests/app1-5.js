const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index.js");

exports.app1_5 = describe("all tests", () => {
  describe("3. GET /api/topics", () => {
    test("should return with 200 status and an array of all the objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;

          expect(topics).toBeInstanceOf(Array);
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });

    test("should return error if enpoint includes an invalid query", () => {
      return request(app)
        .get("/api/genre")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Route not found");
        });
    });
  });

  describe("5. PATCH /api/articles/:article_id", () => {
    test("should return with 200 status and votes to be updated", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -4 })
        .expect(200)
        .then(({ body }) => {
          expect(body.votes).toEqual(96);
        });
    });

    test("should return with error if id does not exist", () => {
      return request(app)
        .patch("/api/articles/19")
        .send({ inc_votes: 4 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article ID:19 not found.");
        });
    });

    test("should return with error if thre is no body", () => {
      return request(app)
        .patch("/api/articles/4")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    test("should return with error if the body message key is incorrect type", () => {
      return request(app)
        .patch("/api/articles/4")
        .send({ increase_votes_by: 4 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });

    test("should return with error if the body message value is incorrect type", () => {
      return request(app)
        .patch("/api/articles/4")
        .send({ inc_votes: "word" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });

    test("should return error 400 when past an invalid id ", () => {
      return request(app)
        .get("/api/articles/sad")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
  });
});
