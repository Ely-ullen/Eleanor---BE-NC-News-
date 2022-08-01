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
  test("should return with 200 status ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        //console.log(topics);
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
      .expect(404)
      .then((response) => {
        console.log(response.body);
        expect(response.body.msg).toBe("Route not found");
      });
  });
});
