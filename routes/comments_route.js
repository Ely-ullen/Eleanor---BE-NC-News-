const {
  getComments,
  postComment,
  deleteComment,
} = require("../controllers/controllers.js");
const commentsRouter = require("express").Router();

commentsRouter.get("/:article_id/comments", getComments);

commentsRouter.post("/:article_id/comments", postComment);

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = { commentsRouter };
