const request = require("supertest");
const app = require("../app.js");
require("jest-sorted");
// const db = require("../db/connection.js");
// const seed = require("../db/seeds/seed");
// const data = require("../db/data/test-data/index.js");

exports.app6_8 = describe("all tests", () => {
  describe("6. GET /api/users", () => {
    test("status:200, responds with an array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const users = body;
          expect(users).toBeInstanceOf(Array);
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe("7. GET /api/articles/:article_id (comment count)", () => {
    test("should resturn an object containging the article with a feild comment_count with the count of comments in the comment table", () => {
      return request(app)
        .get("/api/articles/4")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;

          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("comment_count");
        });
    });

    test("the returned article cooment count value should be 11 ", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.comment_count).toBe("11");
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

  describe("8. GET /api/articles", () => {
    test("should return an array of article objects with correct properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body;

          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(String),
              })
            );
          });
        });
    });

    test("the returned array should be sorted by created at in decending order ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });

    test("topic field, author feild and comment count are correctly joined form their respective tables ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body[0];
          expect(articles.article_id).toBe(3);
          expect(articles.author).toBe("icellusedkars");
          expect(articles.comment_count).toBe("2");
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

  describe("9. GET /api/articles/:article_id/comments", () => {
    test("should return an array of comments for the given `article_id`", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const articles = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(11);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                body: expect.any(String),
                name: expect.any(String),
              })
            );
          });
        });
    });

    test.only("should return an empty array for the given `article_id` if article has no comments", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body }) => {
          const articles = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(0);
        });
    });

    test("should return error 400 not an id when past an invalid id ", () => {
      return request(app)
        .get("/api/articles/sad/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });

    test("should return error 400 not an id when past an invalid id ", () => {
      return request(app)
        .get("/api/articles/sad/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    test('should return an error 404 "id not found" if the artice id does not exist ', () => {
      return request(app)
        .get("/api/articles/6/coomets")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Route not found");
        });
    });
  });
});
