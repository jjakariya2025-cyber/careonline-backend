const jwt = require("jsonwebtoken");

function protect(req, res, next) {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({
        success: false,
        message: "Login required"
      });

    }


    const token =
      authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;


    if (!token) {

      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });

    }


    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    req.user = decoded;

    next();


  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });

  }

}


function adminOnly(req, res, next) {

  if (
    !req.user ||
    req.user.role !== "admin"
  ) {

    return res.status(403).json({

      success: false,

      message:
        "Admin access required"

    });

  }

  next();

}


module.exports = {
  protect,
  adminOnly
};
