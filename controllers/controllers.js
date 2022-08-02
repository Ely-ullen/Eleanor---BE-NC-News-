const { selectTopics, selectArticle } = require("../models/models.js");

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
