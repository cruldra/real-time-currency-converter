const { defineConfig } = require("@vue/cli-service");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const pages = require("./pages");
module.exports = defineConfig({
  transpileDependencies: true,
});

module.exports = {
  pages,
  filenameHashing: false,
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve("manifest.json"),
            to: `${path.resolve("dist")}/manifest.json`,
          },
        ],
      }),
    ],
  },
};
