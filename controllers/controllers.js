const {
  selectTopics,
  selectArticle,
  updateVotes,
  selectUsers,
} = require("../models/models.js");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => res.status(200).send({ topics }));
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

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
