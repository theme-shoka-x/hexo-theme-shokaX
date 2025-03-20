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
var import_package = __toESM(require("../../package.json"));
var import_hexo_util = require("hexo-util");
var import_utils = require("../utils");
hexo.extend.helper.register("_safedump", (source) => {
  return JSON.stringify(source);
});
hexo.extend.helper.register("hexo_env", function(type) {
  return this.env[type];
});
hexo.extend.helper.register("theme_env", function(type) {
  return import_package.default[type];
});
hexo.extend.helper.register("_vendor_font", () => {
  const config = hexo.theme.config.font;
  if (!config || !config.enable) return "";
  const fontDisplay = "&display=swap";
  const fontSubset = "&subset=latin,latin-ext";
  const fontStyles = ":400,400italic,700,700italic";
  const fontHost = "https://fonts.googleapis.com";
  let fontFamilies = ["global", "logo", "title", "headings", "posts", "codes"].map((item) => {
    if (config[item] && config[item].family && config[item].external) {
      return config[item].family + fontStyles;
    }
    return "";
  });
  fontFamilies = fontFamilies.filter((item) => item !== "");
  fontFamilies = [...new Set(fontFamilies)];
  fontFamilies = fontFamilies.join("|");
  return fontFamilies ? (0, import_hexo_util.htmlTag)("link", {
    rel: "stylesheet",
    href: `${fontHost}/css?family=${fontFamilies.concat(fontDisplay, fontSubset)}`,
    media: "none",
    onload: "this.media='all'"
  }) : "";
});
hexo.extend.helper.register("_css", function(...urls) {
  const { statics, css } = hexo.theme.config;
  return urls.map((url) => (0, import_hexo_util.htmlTag)("link", {
    rel: "stylesheet",
    href: import_hexo_util.url_for.call(this, `${statics}${css}/${url}?v=${import_package.default.version}`)
  }), "").join("");
});
hexo.extend.helper.register("_js", function(...urls) {
  const { statics, js } = hexo.theme.config;
  return urls.map((url) => (0, import_hexo_util.htmlTag)("script", { src: import_hexo_util.url_for.call(this, `${statics}${js}/${url}?v=${import_package.default.version}`), type: "module", fetchpriority: "high", defer: true }, "")).join("");
});
hexo.extend.helper.register("vendor_js", function(vendor) {
  const res = (0, import_utils.getVendorLink)(hexo, hexo.theme.config.vendors.js[vendor]);
  return (0, import_hexo_util.htmlTag)("script", { src: res.url, integrity: res.sri, crossorigin: "anonymous", fetchpriority: "high" }, "");
});
hexo.extend.helper.register("_striptags", function(data) {
  return (0, import_hexo_util.stripHTML)(data);
});
hexo.extend.helper.register("_truncate", function(data, end) {
  return data.substring(0, end);
});
