const { getApis } = require("../controllers/controllers.js");
const infoRouter = require("express").Router();

infoRouter.get("/", getApis);

module.exports = { infoRouter };
