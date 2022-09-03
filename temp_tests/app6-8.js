const request = require("supertest");
const app = require("../app.js");
require("jest-sorted");
// const db = require("../db/connection.js");
// const seed = require("../db/seeds/seed");
// const data = require("../db/data/test-data/index.js");

exports.app6_8 = describe("all tests", () => {
  describe("6. GET /api/users", () => {
    test("should return a status:200, and an array of user objects", () => {
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
    test("should return an object containing the article with a feild comment_count with the count of comments in the comment table", () => {
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

    test("should return the articles correct comment count ", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.comment_count).toBe("11");
        });
    });

    test("should return error 400 when passed an invalid id ", () => {
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

    test("should return error 400  when passed an invalid id ", () => {
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

    test("should return an empty array for the given `article_id` if article has no comments", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body }) => {
          const articles = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(0);
        });
    });

    test("should return error 400 not an id when passed an invalid id ", () => {
      return request(app)
        .get("/api/articles/sad/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });

    test("should return error 400 not an id when passed an invalid id ", () => {
      return request(app)
        .get("/api/articles/58/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article ID:58 not found.");
        });
    });
    test("should return an error 404 if there is a sad path ", () => {
      return request(app)
        .get("/api/articles/6/coomets")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Route not found");
        });
    });
  });

  describe("10. POST /api/articles/:article_id/comments", () => {
    test("should post a comment into the comments table", () => {
      const newComment = {
        username: "icellusedkars",
        body: "I cant not believe it",
      };

      return request(app)
        .post("/api/articles/4/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          const comment = body;
          expect(comment.article_id).toEqual(4),
            expect(comment.body).toEqual("I cant not believe it"),
            expect(comment.author).toEqual("icellusedkars");
        });
    });

    test("should return with 404 error when there is no post provided", () => {
      return request(app)
        .post("/api/articles/4/comments")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });

    test("should return with error if the body message keys are incorrect ", () => {
      const newComment = {
        user: "icellusedkars",
        msg: "I cant not believe it",
      };

      return request(app)
        .post("/api/articles/4/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });

    test("should return with error if the the object values are the incorrect type", () => {
      const newComment = {
        user: 8,
        msg: 9,
      };

      return request(app)
        .post("/api/articles/4/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });

    test("should post a comment into the comments table", () => {
      const newComment = {
        username: "icellusedkars",
        body: "I cant not believe it",
      };

      return request(app)
        .post("/api/articles/999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article ID:999 not found.");
        });
    });
  });

  describe("11. GET /api/articles (queries)", () => {
    test("sorts the response by default created_at when there is no sort_by defined in request ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body;

          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });

    test("sorts the response by votes ", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          const articles = body;

          expect(articles).toBeSortedBy("votes", { descending: true });
        });
    });

    test("sorts the response by an articles feild and requested order ", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order_by=ASC")
        .expect(200)
        .then(({ body }) => {
          const articles = body;

          expect(articles).toBeSortedBy("title", { descending: false });
        });
    });

    test("sorts the response by an articles feild, requested order and filters by requeted topic ", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order_by=ASC&topic=cats")
        .expect(200)
        .then(({ body }) => {
          const articles = body;

          expect(articles).toBeSortedBy("title", { descending: false });
          articles.forEach((article) => {
            expect(article.topic).toEqual("cats");
          });
        });
    });

    test("should return all topics if no topics requested ", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order_by=ASC")
        .expect(200)
        .then(({ body }) => {
          const articles = body;

          expect(articles).toBeSortedBy("title", { descending: false });
          expect(articles).toHaveLength(12);
        });
    });

    test("should return an error if order_by is not valid", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order_by=Aggg&topic=spaceman")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Not a valid sort or order query");
        });
    });

    test("should return an error if sort_by is not valid", () => {
      return request(app)
        .get("/api/articles?sort_by=badger&order_by=ASC&topic=spaceman")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Not a valid sort or order query");
        });
    });
  });

  describe("12. DELETE /api/comments/:comment_id", () => {
    test("should  delete comment with comment id", () => {
      return request(app).delete("/api/comments/5").expect(204);
    });
    test("shuold return error if the api is incorrect", () => {
      return request(app)
        .delete("/api/comm/5")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Route not found");
        });
    });
    test("should  delete comment with comment id", () => {
      return request(app).delete("/api/comments/5").expect(204);
    });

    test("should return error 400 not an id when passed an invalid id ", () => {
      return request(app)
        .delete("/api/comments/58")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment Id:58 not found.");
        });
    });

    test("should return error 400 not an id when passed an invalid id ", () => {
      return request(app)
        .delete("/api/comments/notanId")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
  });

  describe("GET /api ", () => {
    test("should return json file wioth list of API and related infomation", () => {
      return request(app).get("/api").expect(200);
    });
  });
});
