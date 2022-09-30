const express = require("express");
const cors = require("cors");
const { apiRouter } = require("./routes/api_router.js");

//const { getTopics, getApis } = require("./controllers/controllers.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", (req, res) => {
  res.status(400).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Invalid input" });
  }
});

module.exports = app;
