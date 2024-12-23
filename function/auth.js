const jsonwebtoken = require("jsonwebtoken");

const authorization = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);
  try {
    let tokenResult = jsonwebtoken.verify(token, process.env.SECRET);
    if (tokenResult) {
      req.workspace = tokenResult.workspace;
      req.email = tokenResult.email;
      next();
    } else {
      res.status(500).json({
        message: "Something wrong",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};

module.exports = authorization;






















