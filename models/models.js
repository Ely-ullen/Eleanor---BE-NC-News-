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

// exports.selectArticles = () => {
//   const queryStr =
//     "SELECT articles.article_id, articles.title, articles.topic, users.username AS author,  articles.body, articles.created_at, articles.votes , COUNT(comment_id) AS comment_count FROM articles JOIN users ON articles.author = users.username LEFT JOIN comments ON comments.article_id = articles.article_id  GROUP BY articles.article_id , users.username ORDER BY articles.created_at DESC";
//   return db.query(queryStr).then(({ rows }) => {
//     const article = rows;

//     return article;
//   });
// };

exports.selectComments = (articleId) => {
  const validId = "SELECT article_id FROM articles WHERE article_id = $1";
  const queryStr =
    "SELECT comments.comment_id, comments.votes, comments.created_at, comments.body , users.name FROM comments JOIN users ON comments.author = users.username WHERE comments.article_id = $1";

  const query1 = db.query(validId, [articleId]).then(({ rows }) => {
    return rows;
  });
  const query2 = db.query(queryStr, [articleId]).then(({ rows }) => {
    const comments = rows;
    return comments;
  });

  return Promise.all([query1, query2]).then((result) => {
    if (result[0].length === 0) {
      return Promise.reject({
        status: 404,
        msg: `Article ID:${articleId} not found.`,
      });
    }
    return result[1];
  });
};

exports.addComment = (articleId, comment) => {
  const queryStr =
    "INSERT INTO comments (body,  author, article_id) VALUES ($2, $1, $3) RETURNING*";

  return db
    .query(queryStr, [comment.username, comment.body, articleId])
    .then(({ rows }) => {
      const comments = rows[0];

      return comments;
    });
};

exports.selectArticles = (sortBy = `created_at`, orderBy = `DESC`, topic) => {
  const validSortBy = [
    "author",
    "title",
    "body",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];

  const validOrderBy = ["ASC", "DESC"];

  if (!validSortBy.includes(sortBy) || !validOrderBy.includes(orderBy)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryStr =
    "SELECT articles.article_id, articles.title, articles.topic, users.username AS author,  articles.body, articles.created_at, articles.votes , COUNT(comment_id) AS comment_count FROM articles JOIN users ON articles.author = users.username LEFT JOIN comments ON comments.article_id = articles.article_id ";

  if (topic) {
    queryStr += `WHERE articles.topic = $1 GROUP BY articles.article_id , users.username ORDER BY ${sortBy} ${orderBy};`;

    return db.query(queryStr, [topic]).then(({ rows }) => {
      const article = rows;

      return article;
    });
  } else {
    queryStr += `GROUP BY articles.article_id , users.username ORDER BY ${sortBy} ${orderBy};`;

    return db.query(queryStr).then(({ rows }) => {
      const article = rows;

      return article;
    });
  }
};

// exports.removeComment = (commentId) => {
//   const queryStr = "DELETE FROM comments WHERE comment_id = $1 RETURNING*";
//   return db.query(queryStr, [commentId]).then(({ rows }) => {
//     let comment = rows[0];
//     if (!comment) {
//       return Promise.reject({
//         status: 404,
//         msg: `Comment Id:${commentId} not found.`,
//       });
//     }
//   });
// };
