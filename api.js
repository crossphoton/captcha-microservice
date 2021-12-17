const express = require("express");
const app = express();
const { image_text, verify } = require("./src");
const logger = require("./src/logging");
const { verifyJWTToken } = require("./src/jwt");

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/captcha/imageCaptcha.png", async (_req, res) => {
  var captcha;
  try {
    captcha = await image_text.generate();
  } catch (error) {
    return res.sendStatus(500);
  }

  res.setHeader("Content-Type", "image/png");
  res.setHeader("X-Captcha-Session-Id", captcha.sessionId);

  res.send(captcha.captcha);
});

app.get("/verify", async (req, res) => {
  const { sessionId, solution } = req.query;
  try {
    const valid = await verify(sessionId, solution);
    valid ? res.send(valid) : res.sendStatus(401);
  } catch (err) {
    logger.error(err);
    res.send(null).statusCode(401);
  }
});

app.get("/validate", async (req, res) => {
  const { sessionId, token } = req.query;
  if (!token || !sessionId) {
    return res.sendStatus(400);
  }
  try {
    const valid = await verifyJWTToken(token);
    valid && valid.sessionId === sessionId
      ? res.sendStatus(200)
      : res.sendStatus(401);
  } catch (err) {
    logger.error(err.message);
    res.sendStatus(500);
  }
});

module.exports = app;
