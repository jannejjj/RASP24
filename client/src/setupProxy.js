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

