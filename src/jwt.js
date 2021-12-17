const jwt = require("jsonwebtoken");

function createJWTToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "secret", {
    expiresIn: "30m",
    header: {
      alg: "HS256",
      typ: "JWT",
    },
    subject: "captcha",
    encoding: "utf8",
    issuer: process.env.HOST || "captcha-service",
  });
}

function verifyJWTToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "secret", {
      subject: "captcha",
      issuer: process.env.HOST || "captcha-service",
    });
  } catch (err) {
    return null;
  }
}

module.exports = {
  createJWTToken,
  verifyJWTToken,
};
