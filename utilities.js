const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // ✅ use bracket notation
  const token = authHeader && authHeader.split(" ")[1]; // ✅ split by space, not empty string

  if (!token) 
     return res.status(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) 
      return res.sendStatus(401)
    req.user = user;
    next();
  });
}

module.exports = {
  authenticateToken, // ✅ consistent name with your import in index.js
};
