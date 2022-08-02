const db = require("../db/connection.js");

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
