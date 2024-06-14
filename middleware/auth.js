const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req?.headers?.authorization?.split(" ")[1];
  if (!token) return res.send("You are not authorized");

  try {
    const verify = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!verify?.email) return res.send("You are not authorized");
    req.user = verify.email;
    next();
  } catch (err) {
    res.send("You are not authorized");
  }
}

module.exports = verifyToken;
