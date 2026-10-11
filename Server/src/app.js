const express = require("express");
const aiRouter = require("./routes/ai.routes");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/ai", aiRouter);

module.exports = app;
