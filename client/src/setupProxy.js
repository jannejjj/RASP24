/*
File: setupProxy.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Description: Sets up proxy middleware.
GitHub: https://github.com/jannejjj/RASP24
*/

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.REACT_APP_PROXY_TARGET,
      changeOrigin: true,
    })
  );
  app.use(
    "/users",
    createProxyMiddleware({
      target: process.env.REACT_APP_PROXY_TARGET,
      changeOrigin: true,
    })
  );
};

