const expressApp = require("./api");
const helmet = require("helmet");
const { createLightship } = require("lightship");
const rateLimiter = require("./src/rateLimit");
const { logger } = require("./src/logging");
const prometheus = require("./src/prometheus");
const PORT = process.env.PORT || 5000;

// Add middleware
prometheus(expressApp); // Add prometheus middleware
expressApp.use(helmet()); // Add helmet middleware
expressApp.use(rateLimiter); // Add rate limiter middleware

// Health check
expressApp.get("/healthz", (_req, res) => {
  res.send("OK");
});

// Start the server
const server = expressApp
  .listen(PORT, () => {
    logger.info(`listening on ${PORT}`);
    lightship.signalReady();
  })
  .on("error", () => {
    logger.info(`shutting down server`);
    lightship.shutdown();
  });

const lightship = createLightship();

lightship.registerShutdownHandler(() => {
  server.close();
});
