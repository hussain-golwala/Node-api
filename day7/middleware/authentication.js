var jwt = require("jsonwebtoken");
function checkJwtAuthentication(req, res, next) {
  if (req.headers && req.headers.authorization) {
    jwt.verify(
      req.headers.authorization,
      "my_secret",
      function (err, decoded) {
        if (err) {
          return res.status(401).json({
            success: false,
            Error: true,
            data: Array(),
            msg: "Failed to authenticate Token ",
          });
        }
        console.log(decoded, "Decoded");
        return next();
      }
    );
  } else {
    return res.status(401).json({
      success: false,
      Error: true,
      data: Array(),
      msg: "Failed to authenticate Token ",
    });
  }
}

module.exports = checkJwtAuthentication;
