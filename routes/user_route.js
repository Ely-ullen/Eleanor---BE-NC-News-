const { getUsers } = require("../controllers/controllers.js");
const userRouter = require("express").Router();

userRouter.get("/", getUsers);

module.exports = { userRouter };
