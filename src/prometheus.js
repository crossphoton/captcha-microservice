const prometheusMiddleware = require("express-prometheus-middleware");
var prom_middleware = prometheusMiddleware({
  metricsPath: "/metrics",
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.25, 0.5, 0.75, 1, 2, 5, 10],
  collectDefaultLabels: true,
  defaultLabels: {
    version: "1.0.0",
  },
});

function addPrometheus(app) {
  // Enabling prometheus metrics
  app.use(prom_middleware);
}

module.exports = addPrometheus;
