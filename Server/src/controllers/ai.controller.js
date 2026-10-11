async function codeReviewerController(req, res) {
  const code = req.body.code;

  console.log(code);

  res.json({
    message: "Code Reviewed Successfully",
  });
}

module.exports = codeReviewerController;
