const {
  patchVotes,
  getArticleWithComments,
  getArticles,
} = require("../controllers/controllers.js");
const articlesRouter = require("express").Router();

articlesRouter.patch("/:article_id", patchVotes);

articlesRouter.get("/:article_id", getArticleWithComments);

articlesRouter.get("/", getArticles);

module.exports = { articlesRouter };
