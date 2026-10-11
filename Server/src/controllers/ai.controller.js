const aiServiceCodeReviewer = require("../services/ai.service");

async function codeReviewerController(req, res) {
  const code = req.body.code;

  const response = await aiServiceCodeReviewer(code);

  res.json({
    message: "Code Reviewed Successfully",
    response,
  });
}

module.exports = codeReviewerController;
