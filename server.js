const expressApp = require("./api");
const logger = require("./src/logging");
const prometheus = require("./src/prometheus");
const PORT = process.env.PORT || 5000;

// Add prometheus middleware
prometheus(expressApp);

// Health check
expressApp.get("/healthz", (_req, res) => {
  res.send("OK");
});

// Start the server
expressApp.listen(PORT, () => logger.info(`listening on ${PORT}`));
