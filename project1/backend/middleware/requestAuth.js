const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

const requireAuth = async (req, res, next) => {

  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ msg: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {

    const { _id } = jwt.verify(token, process.env.JWTSECRET);

    req.user = await User.findOne({ _id }).select("_id");

    next();

  } catch (error) {

    console.error(error);
    return res.status(401).json({ msg: "Request is not authenticated" });

  }
};

module.exports = requireAuth;