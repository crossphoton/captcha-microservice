const express = require("express");
const app = express();
const compression = require("compression");
const { image_text, math_text, verify } = require("./src");
const { logger, middleware: logMiddleWare } = require("./src/logging");
const { verifyJWTToken } = require("./src/jwt");

app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true }));
app.enable("trust proxy");
app.use(logMiddleWare);
app.use(
  compression({
    filter: shouldCompress,
    level: 9,
  })
);

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) return false;
  return compression.filter(req, res);
}

app.get("/verify", (req, res) => {
  const { sessionId, solution } = req.query;
  if (!sessionId || !solution) {
    return res.sendStatus(400);
  }
  try {
    verify(sessionId, solution).then((valid) => {
      valid ? res.send(valid) : res.sendStatus(401);
    });
  } catch (err) {
    logger.error(err.message);
    res.send(null).statusCode(401);
  }
});

app.get("/validate", (req, res) => {
  const { sessionId, token } = req.query;
  if (!token || !sessionId) {
    return res.sendStatus(400);
  }
  try {
    verifyJWTToken(token).then((valid) => {
      valid && valid.sessionId === sessionId
        ? res.sendStatus(200)
        : res.sendStatus(401);
    });
  } catch (err) {
    logger.error(err.message);
    res.sendStatus(500);
  }
});

app.get("/captcha/imageCaptcha", image_text.middleware);

app.get("/captcha/mathCaptcha", math_text.middleware);

// Pick a random captcha method
const randomCaptcha = (req, res, next) => {
  const map = [image_text, math_text];
  return map[Math.floor(Math.random() * map.length)].middleware(req, res, next);
};

app.get("/captcha/captcha", randomCaptcha);

module.exports = app;
