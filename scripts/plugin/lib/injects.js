var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var injects_exports = {};
__export(injects_exports, {
  default: () => injects_default
});
module.exports = __toCommonJS(injects_exports);
var import_node_fs = __toESM(require("node:fs"));
var import_node_path = __toESM(require("node:path"));
var import_injects_point = __toESM(require("./injects-point"));
/*!
  inject.js in next-theme/hexo-theme-next by next-theme
  under GNU AFFERO GENERAL PUBLIC LICENSE v3.0 OR LATER
  https://github.com/next-theme/hexo-theme-next/blob/master/LICENSE.md
 */
const defaultExtname = ".pug";
class StylusInject {
  files;
  base_dir;
  constructor(base_dir) {
    this.base_dir = base_dir;
    this.files = [];
  }
  push(file) {
    this.files.push(import_node_path.default.resolve(this.base_dir, file));
  }
}
class ViewInject {
  base_dir;
  raws;
  constructor(base_dir) {
    this.base_dir = base_dir;
    this.raws = [];
  }
  raw(name, raw, ...args) {
    if (import_node_path.default.extname(name) === "") {
      name += defaultExtname;
    }
    this.raws.push({ name, raw, args });
  }
  file(name, file, ...args) {
    if (import_node_path.default.extname(name) === "") {
      name += import_node_path.default.extname(file);
    }
    this.raw(name, import_node_fs.default.readFileSync(import_node_path.default.resolve(this.base_dir, file), "utf8"), ...args);
  }
}
function initInject(base_dir) {
  const injects = {};
  import_injects_point.default.styles.forEach((item) => {
    injects[item] = new StylusInject(base_dir);
  });
  import_injects_point.default.views.forEach((item) => {
    injects[item] = new ViewInject(base_dir);
  });
  return injects;
}
var injects_default = (hexo) => {
  const injects = initInject(hexo.base_dir);
  hexo.execFilterSync("theme_inject", injects);
  hexo.theme.config.injects = {};
  import_injects_point.default.styles.forEach((type) => {
    hexo.theme.config.injects[type] = injects[type].files;
  });
  import_injects_point.default.views.forEach((type) => {
    const configs = /* @__PURE__ */ Object.create(null);
    hexo.theme.config.injects[type] = [];
    injects[type].raws.forEach((injectObj, index) => {
      const name = `inject/${type}/${injectObj.name}`;
      hexo.theme.setView(name, injectObj.raw);
      configs[name] = {
        layout: name,
        locals: injectObj.args[0],
        options: injectObj.args[1],
        order: injectObj.args[2] || index
      };
    });
    hexo.theme.config.injects[type] = Object.values(configs).sort((x, y) => x.order - y.order);
  });
};
