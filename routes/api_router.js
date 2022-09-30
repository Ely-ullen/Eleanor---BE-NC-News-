const apiRouter = require("express").Router();
const { userRouter } = require("./user_route.js");
const { articlesRouter } = require("./articles_route.js");
const { commentsRouter } = require("./comments_route.js");
const { topicsRouter } = require("./topics_route.js");
const { infoRouter } = require("./info_route.js");

apiRouter.use("/users", userRouter);
apiRouter.use("/", infoRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
//apiRouter.use("/articles/:article_id/comments", commentsRouter);
module.exports = { apiRouter };
