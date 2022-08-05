const express = require("express");
const {
  getTopics,
  patchVotes,
  getUsers,
  getArticleWithComments,
  getArticles,
  getComments,
  postComment,
  deleteComment,
} = require("./controllers/controllers.js");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

//app.get("/api/articles/:article_id", getArticle);

app.patch("/api/articles/:article_id", patchVotes);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleWithComments);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

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
