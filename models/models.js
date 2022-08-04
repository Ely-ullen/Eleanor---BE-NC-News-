const { request } = require("../app.js");
const db = require("../db/connection.js");
//const { findArticle } = require("models.utils.js");

exports.selectTopics = () => {
  const queryStr = "SELECT * FROM topics;";
  return db.query(queryStr).then((topics) => topics.rows);
};

exports.updateVotes = (articleId, votes) => {
  const queryStr =
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*";
  return db.query(queryStr, [votes.inc_votes, articleId]).then(({ rows }) => {
    const voteUpdate = rows[0];
    if (!voteUpdate) {
      return Promise.reject({
        status: 404,
        msg: `Article ID:${articleId} not found.`,
      });
    }

    return voteUpdate;
  });
};

exports.selectUsers = () => {
  const queryStr = "SELECT * FROM users";
  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};

exports.selectArticleWithComments = (articleId) => {
  const queryStr =
    "SELECT articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes , COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id";

  return db.query(queryStr, [articleId]).then(({ rows }) => {
    const article = rows[0];
    if (!article) {
      return Promise.reject({
        status: 404,
        msg: `Article ID:${articleId} not found.`,
      });
    }
    return article;
  });
};

exports.selectArticles = () => {
  const queryStr =
    "SELECT articles.article_id, articles.title, articles.topic, users.username AS author,  articles.body, articles.created_at, articles.votes , COUNT(comment_id) AS comment_count FROM articles JOIN users ON articles.author = users.username LEFT JOIN comments ON comments.article_id = articles.article_id  GROUP BY articles.article_id , users.username ORDER BY articles.created_at DESC";
  return db.query(queryStr).then(({ rows }) => {
    const article = rows;

    return article;
  });
};

exports.selectComments = (articleId) => {
  const queryStr =
    "SELECT comments.comment_id, comments.votes, comments.created_at, comments.body , users.name FROM comments JOIN users ON comments.author = users.username WHERE comments.article_id = $1";
  return db.query(queryStr, [articleId]).then(({ rows }) => {
    const comments = rows;

    return comments;
  });
};

exports.addComment = (articleId, comment) => {
  const queryStr =
    "INSERT INTO comments (votes, created_at, body,  author, article_id) VALUES (0, 'today', $2, $1, $3) RETURNING*";

  return db
    .query(queryStr, [comment.username, comment.body, articleId])
    .then(({ rows }) => {
      const comments = rows[0];

      return comments;
    });
};
