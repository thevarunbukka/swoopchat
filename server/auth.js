const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "swoopchatsecrettokenforuser");
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "NOT_AUTHENTICATED",
    });
  }
  if (!decodedToken) {
    res.status(401).json({
      status: "NOT_AUTHENTICATED",
    });
  }
  if (decodedToken) {
    req.authenticatedUserId = decodedToken.user;
    next();
  }
};
