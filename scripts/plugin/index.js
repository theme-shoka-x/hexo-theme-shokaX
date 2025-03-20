var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_injects = __toESM(require("./lib/injects"));
var import_package = require("../../package.json");
var fs = __toESM(require("node:fs"));
/*!
  index.js in next-theme/hexo-theme-next by next-theme
  under GNU AFFERO GENERAL PUBLIC LICENSE v3.0 OR LATER
  https://github.com/next-theme/hexo-theme-next/blob/master/LICENSE.md
 */
hexo.on("generateBefore", () => {
  (0, import_injects.default)(hexo);
  fs.rmSync("./shokaxTemp", { force: true, recursive: true });
  if (fs.existsSync("cf-patch.js")) {
    fs.unlinkSync("cf-patch.js");
  }
  if (fs.existsSync("request.lock")) {
    fs.unlinkSync("request.lock");
  }
  if (fs.existsSync("requested.lock")) {
    fs.unlinkSync("requested.lock");
  }
});
hexo.on("generateAfter", () => {
  fetch("https://registry.npmmirror.com/hexo-theme-shokax/latest", { headers: {
    "User-Agent": "ShokaX Client (hexo-theme-shokax)"
  } }).then((res) => {
    res.json().then((resp) => {
      try {
        const latest = resp["version"];
        const current = import_package.version.split(".");
        let isOutdated = false;
        for (let i = 0; i < Math.max(latest.length, current.length); i++) {
          if (!current[i] || latest[i] > current[i]) {
            isOutdated = true;
            break;
          }
          if (latest[i] < current[i]) {
            break;
          }
        }
        if (isOutdated) {
          hexo.log.warn(`Your theme ShokaX is outdated. Current version: v${current.join(".")}, latest version: v${latest.join(".")}`);
          hexo.log.warn("Visit https://github.com/theme-shoka-x/hexo-theme-shokaX/releases for more information.");
        }
      } catch (e) {
        hexo.log.warn("Failed to detect version info. Error message:");
        hexo.log.warn(e);
      }
    }).catch((e) => {
      hexo.log.warn("Failed to detect version info. Error message:");
      hexo.log.warn(e);
    });
  });
});
