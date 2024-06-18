const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  // devServer: {
  //   proxy: {
  //     "/api": {
  //       target: "",
  //       secure: false,
  //       changeOrigin: true,
  //       pathRewrite: {
  //         "^/api": "",
  //       },
  //       onProxyReq(proxyReq, req, res) {
  //         proxyReq.setHeader("Cookie", "poxxxxx....");
  //       },
  //     },
  //   },
  // },
});
