// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "api",
      script: "src/server.js", // or main entry point
      interpreter: "node",
      watch: true,
      ignore_watch: ["node_modules"],
      env: {
        NODE_ENV: "development"
      }
    }
  ]
};