var captchagen = require("captchagen");
const { store } = require("./store");

const generate = async () => {
  const captcha = captchagen.create();
  captcha.generate();
  const sessionId = await store(captcha.text());

  return {
    captcha: captcha.buffer(),
    sessionId,
  };
};

module.exports = { generate };
