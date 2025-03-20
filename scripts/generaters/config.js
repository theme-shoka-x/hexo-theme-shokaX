"use strict";
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
var import_hexo_util = require("hexo-util");
var import_node_fs = __toESM(require("node:fs"));
var import_path = __toESM(require("path"));
var import_js_yaml = __toESM(require("js-yaml"));
hexo.extend.filter.register("before_generate", () => {
  if (hexo.config.theme_config) {
    hexo.theme.config = (0, import_hexo_util.deepMerge)(hexo.theme.config, hexo.config.theme_config);
  }
  const data = hexo.locals.get("data");
  if (data.languages) {
    const { i18n } = hexo.theme;
    const mergeLang = (lang) => {
      if (data.languages[lang]) {
        i18n.set(lang, (0, import_hexo_util.deepMerge)(i18n.get([lang]), data.languages[lang]));
      }
    };
    for (const lang of ["en", "ja", "zh-CN", "zh-HK", "zh-TW"]) {
      mergeLang(lang);
    }
  }
  hexo.theme.config.style = {};
  for (const style of ["iconfont", "colors", "custom"]) {
    const custom_file = "source/_data/" + style + ".styl";
    if (import_node_fs.default.existsSync(custom_file)) {
      hexo.theme.config.style[style] = import_path.default.resolve(hexo.base_dir, custom_file);
    }
  }
  if (data.images && data.images.length > 0) {
    hexo.theme.config.image_list = data.images;
  } else {
    hexo.theme.config.image_list = import_js_yaml.default.load(import_node_fs.default.readFileSync(import_path.default.join(__dirname, "../../_images.yml"), { encoding: "utf-8" }));
  }
  if (data.images_index && data.images_index.length > 0) {
    hexo.theme.config.index_images = data.images_index;
  } else if (import_node_fs.default.existsSync(import_path.default.join(__dirname, "../../_images_index.yml"))) {
    hexo.theme.config.index_images = import_js_yaml.default.load(import_node_fs.default.readFileSync(import_path.default.join(__dirname, "../../_images_index.yml"), { encoding: "utf-8" }));
  } else {
    hexo.theme.config.index_images = data.index_images || [];
  }
});
