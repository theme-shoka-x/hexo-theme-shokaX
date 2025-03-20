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
var import_node_fs = __toESM(require("node:fs"));
var import_node_path = __toESM(require("node:path"));
var import_js_yaml = __toESM(require("js-yaml"));
function linkGrid(args, content) {
  const theme = hexo.theme.config;
  if (!args[0] && !content) {
    return;
  }
  if (args[0]) {
    const filepath = import_node_path.default.join(hexo.source_dir, args[0]);
    if (import_node_fs.default.existsSync(filepath)) {
      content = import_node_fs.default.readFileSync(filepath, { encoding: "utf-8" });
    }
  }
  if (!content) {
    return;
  }
  const list = import_js_yaml.default.load(content);
  let result = "";
  list.forEach((item) => {
    if (!item.url || !item.site) {
      return;
    }
    let item_image = item.image || theme.assets + "/404.png";
    if (!item_image.startsWith("//") && !item_image.startsWith("http")) {
      item_image = theme.statics + item_image;
    }
    item.color = item.color ? ` style="--block-color:${item.color};"` : "";
    result += `<div class="item" title="${item.owner || item.site}"${item.color}>`;
    result += `<a href="${item.url}" class="image" data-background-image="${item_image}"></a>
        <div class="info">
        <a href="${item.url}" class="title">${item.site}</a>
        <p class="desc">${item.desc || item.url}</p>
        </div></div>`;
  });
  return `<div class="links">${result}</div>`;
}
hexo.extend.tag.register("links", linkGrid, { ends: true });
hexo.extend.tag.register("linksfile", linkGrid, { ends: false, async: true });
