var captchagen = require("captchagen");
const { store } = require("./store");

const generate = async () => {
  const captcha = captchagen.create();
  captcha.generate();
  const sessionId = await store(captcha.text());

  return {
    /** @type {Buffer} */ captcha: captcha.buffer(),
    /** @type {string} */ sessionId,
  };
};

const middleware = (_req, res) => {
  try {
    generate().then((captcha) => {
      res.setHeader("Content-Type", "image/png");
      res.setHeader("X-Captcha-Session-Id", captcha.sessionId);

      res.send(captcha.captcha);
    });
  } catch (error) {
    logger.error(error.message);
    res.sendStatus(500);
  }
};

module.exports = { middleware };
