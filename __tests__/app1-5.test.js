const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index.js");

beforeEach(() => seed(data));
afterAll(() => {
  if (db.end) db.end();
});

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

  test("returns error if enpoint includes an invalid query", () => {
    return request(app)
      .get("/api/genre")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Route not found");
      });
  });
});

describe("4. GET /api/articles/:article_id", () => {
  test("should return with 200 status and the article object", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
      });
  });

  test("should return error 400 not an id when past an invalid id ", () => {
    return request(app)
      .get("/api/articles/sad")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });

  test('should return an error 404 "id not found" if the artice id does not exist ', () => {
    return request(app)
      .get("/api/articles/18")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID:18 not found.");
      });
  });
});

describe("5. PATCH /api/articles/:article_id", () => {
  test("should return with 200 status and an array of all the objects", () => {
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

  test("should return with error if the body message key is incorrect type", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({ inc_votes: "word" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });

  test("should return error 400 not an id when past an invalid id ", () => {
    return request(app)
      .get("/api/articles/sad")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});
