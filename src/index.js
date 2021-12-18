module.exports = {
  image_text: require("./imageCaptcha"),
  math_text: require("./mathCaptcha"),
  verify: require("./store").verify,
};
