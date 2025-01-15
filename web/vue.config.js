const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: "127.0.0.1",
    port: 10090,
    proxy: {
      "/": {
        target: "http://127.0.0.1:10088",
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "127.0.0.1",
        cookiePathRewrite: {
          "*": "/",
        },
        ws: false,
      },
    },
    // 代理 SSE 需要特别设置 `sse-doent-work-with-vue-cli-devserver-proxy`
    // https://stackoverflow.com/questions/71783075/
    compress: false,
  },
  outputDir: "../server/statics",
});
