const { defineConfig } = require("@vue/cli-service");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const pages = require("./pages");
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
module.exports = defineConfig({
  transpileDependencies: true,
});

module.exports = {
  pages,
  filenameHashing: false,
  configureWebpack: {
    devtool: "source-map",
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve("manifest.json"),
            to: `${path.resolve("dist")}/manifest.json`,
          },
          {
            from: path.resolve("_locales"),
            to: `${path.resolve("dist")}/_locales`,
          },
        ],
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
};
