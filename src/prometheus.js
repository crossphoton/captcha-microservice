const prometheusMiddleware = require("express-prometheus-middleware");
var prom_middleware = prometheusMiddleware({
  metricsPath: "/metrics",
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.25, 0.5, 0.75, 1, 2, 5, 10],
  collectDefaultLabels: true,
  defaultLabels: {
    version: "1.0.0",
  },
  authenticate: function (req) {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return false;
    }
    const authHeaderParts = authHeader.split(" ");
    if (authHeaderParts.length !== 2) {
      return false;
    }
    const scheme = authHeaderParts[0];
    const credentials = authHeaderParts[1];
    if (scheme !== "Bearer") {
      return false;
    }
    return credentials === process.env.PROMETHEUS_SECRET || "secret";
  },
});

function addPrometheus(app) {
  // Enabling prometheus metrics
  app.use(prom_middleware);
}

module.exports = addPrometheus;
