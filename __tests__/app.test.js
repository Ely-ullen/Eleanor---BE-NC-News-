const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index.js");
const { app1_5 } = require("../temp_tests/app1-5.js");
const { app6_8 } = require("../temp_tests/app6-8.js");

beforeEach(() => seed(data));
afterAll(() => {
  if (db.end) db.end();
});

app1_5;
app6_8;
