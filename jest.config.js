module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  testEnvironment: "node",
  setupFiles: ["fake-indexeddb/auto"],
};
