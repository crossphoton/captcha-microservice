const text_to_image = require("text-to-image");
const { store } = require("./store");
const { logger } = require("./logging");
const map = [addition, subtraction, multiplication];

async function generate() {
  // Select a method from map
  const method = map[Math.floor(Math.random() * map.length)];
  const challenge = method();
  const sessionId = await store(challenge.answer.toString());

  // Generate image
  var image;
  try {
    image = await text_to_image.generate(challenge.question, {
      textAlign: "center",
      fontWeight: "bold",
      maxWidth: 150,
    });
  } catch (error) {
    logger.error(error.message);
  }

  return { captcha: Buffer.from(image.split(",")[1], "base64"), sessionId };
}

function addition() {
  var a = Math.floor(Math.random() * 100),
    b = Math.floor(Math.random() * 100);

  return { question: `${a} + ${b}`, answer: a + b };
}

function subtraction() {
  var a = Math.floor(Math.random() * 100) + 100,
    b = Math.floor(Math.random() * 100);

  return { question: `${a} - ${b}`, answer: a - b };
}

function multiplication() {
  var a = Math.floor(Math.random() * 30),
    b = Math.floor(Math.random() * 10);

  return { question: `${a} x ${b}`, answer: a * b };
}

// function division() {
//   var a = Math.floor(Math.random() * 30),
//     b = Math.floor(Math.random() * 10);

//   return { question: `${a} / ${b}`, answer: a / b };
// }

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
