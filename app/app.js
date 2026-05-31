"use strict";

const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 8080;
const ENV = process.env.APP_ENV || "development";
const VERSION = process.env.npm_package_version || "1.0.0";

app.use(express.json());

// Health check endpoint - Elastic Beanstalk ALB checks this
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// Info endpoint
app.get("/info", (req, res) => {
  res.json({
    app: "cicd-demo-app",
    version: VERSION,
    environment: ENV,
    hostname: os.hostname(),
    uptime: Math.floor(process.uptime()) + " seconds",
    nodeVersion: process.version
  });
});

// Home page
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Project 4 - CI/CD Demo</title>
      <style>
        body { font-family: sans-serif; max-width: 650px; margin: 60px auto; padding: 0 20px; color: #333; }
        h1 { color: #232F3E; }
        .badge { background: #28a745; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
        .card { background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 20px 0; }
        code { background: #e9ecef; padding: 2px 6px; border-radius: 4px; }
        .orange { color: #FF9900; font-weight: bold; }
      </style>
    </head>
    <body>
      <span class="badge">LIVE</span>
      <h1>Project 4 - CI/CD Pipeline</h1>
      <p>Deployed automatically via <span class="orange">GitHub push to CodePipeline to CodeBuild to Elastic Beanstalk</span>.</p>
      <div class="card">
        <h3>Deployment Info</h3>
        <p><strong>Version:</strong> <code>${VERSION}</code></p>
        <p><strong>Environment:</strong> <code>${ENV}</code></p>
        <p><strong>Host:</strong> <code>${os.hostname()}</code></p>
        <p><strong>Node.js:</strong> <code>${process.version}</code></p>
        <p><strong>Uptime:</strong> <code>${Math.floor(process.uptime())} seconds</code></p>
      </div>
      <div class="card">
        <h3>Pipeline Flow</h3>
        <p>GitHub push triggers webhook, CodePipeline pulls source, CodeBuild runs tests and packages the app, Elastic Beanstalk does a rolling deployment with zero downtime.</p>
      </div>
      <p>Check <a href="/health">/health</a> and <a href="/info">/info</a> endpoints.</p>
    </body>
    </html>
  `);
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.path });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} - environment: ${ENV}`);
});

module.exports = app;
