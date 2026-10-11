const express = require("express");
const codeReviewerController = require("../controllers/ai.controller");
const route = express.Router();

route.post("/revie-code" , codeReviewerController);

module.exports = route;
