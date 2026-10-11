const express = require("express");
const aiRouter = require("./routes/ai.routes");
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/ai", aiRouter);

module.exports = app;
