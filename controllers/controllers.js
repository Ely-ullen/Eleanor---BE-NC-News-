const {
  selectTopics,
  updateVotes,
  selectUsers,
  selectArticleWithComments,
  selectArticles,
  selectComments,
  addComment,
  removeComment,
} = require("../models/models.js");
const endpoints = require("../endpoints.json");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => res.status(200).send({ topics }));
};

// exports.getArticle = (req, res, next) => {
//   const { article_id } = req.params;
//   selectArticle(article_id)
//     .then((article) => {
//       res.status(200).send({ article });
//     })
//     .catch(next);
// };

exports.patchVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;

  updateVotes(article_id, body)
    .then((update) => {
      res.status(200).send(update);
    })

    .catch(next);
};

exports.getUsers = (req, res) => {
  selectUsers().then((users) => {
    res.status(200).send(users);
  });
};

exports.getArticleWithComments = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleWithComments(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

// exports.getArticles = (req, res, next) => {
//   selectArticles().then((articles) => {
//     res.status(200).send(articles);
//   });
// };

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  selectComments(article_id)
    .then((comment) => {
      res.status(200).send(comment);
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  addComment(article_id, body)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by } = req.query;
  const { order_by } = req.query;
  const { topic } = req.query;

  selectArticles(sort_by, order_by, topic)
    .then((articles) => {
      res.status(200).send(articles);
    })

    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then((comment) => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getApis = (req, res) => {
  res.status(200).send(endpoints);
};
