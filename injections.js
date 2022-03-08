const fs = require("fs");
const path = require("path");
const dir = "src/injections";
let injections = [];
fs.readdirSync(dir)
  .filter((fileName) => {
    const isDir = fs.statSync(`${dir}/${fileName}`).isDirectory();
    return isDir;
  })
  .forEach((injectionName) => {
    const mainJs = `${dir}/${injectionName}/main.js`;
    const mainCss = `${dir}/${injectionName}/main.css`;

    const fileCopings = [
      {
        from: path.resolve(mainJs),
        to: `${path.resolve("dist")}/injections/${injectionName}.js`,
      },
      {
        from: path.resolve(mainCss),
        to: `${path.resolve("dist")}/injections/${injectionName}.css`,
      },
    ];
    injections = injections.concat(fileCopings);
  });
module.exports = injections;
