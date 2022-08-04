const {
  selectTopics,
  updateVotes,
  selectUsers,
  selectArticleWithComments,
  selectArticles,
  selectComments,
  addComment,
} = require("../models/models.js");

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

exports.getArticles = (req, res, next) => {
  selectArticles().then((articles) => {
    res.status(200).send(articles);
  });
};

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
