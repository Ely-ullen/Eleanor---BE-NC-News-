const { request } = require("../app.js");
const db = require("../db/connection.js");
//const { findArticle } = require("models.utils.js");

exports.selectTopics = () => {
  const queryStr = "SELECT * FROM topics;";
  return db.query(queryStr).then((topics) => topics.rows);
};

exports.selectArticle = (articleId) => {
  const queryStr = "SELECT * FROM articles WHERE article_id = $1";
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
