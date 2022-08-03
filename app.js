const express = require("express");
const {
  getTopics,
  getArticle,
  patchVotes,
} = require("./controllers/controllers.js");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.patch("/api/articles/:article_id", patchVotes);

app.all("/*", (req, res) => {
  res.status(400).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Invalid input" });
  }
});

module.exports = app;
