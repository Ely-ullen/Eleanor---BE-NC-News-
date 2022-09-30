const { getTopics } = require("../controllers/controllers.js");
const topicsRouter = require("express").Router();

topicsRouter.get("/", getTopics);

module.exports = { topicsRouter };
