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
const randomServer = parseInt(String(Math.random() * 4), 10) + 1;
const randomBG = function(count = 1, image_server = null, image_list = []) {
  let i;
  if (image_server) {
    if (count && count > 1) {
      const arr = new Array(count);
      for (i = 0; i < arr.length; i++) {
        arr[i] = image_server + "?" + Math.floor(Math.random() * 999999);
      }
      return arr;
    }
    return image_server + "?" + Math.floor(Math.random() * 999999);
  }
  const parseImage = function(img, size) {
    if (img.startsWith("//") || img.startsWith("http")) {
      return img;
    } else if (hexo.theme.config.experiments?.usingRelative) {
      return img;
    } else {
      console.warn("sinaimg blocked all request from outside website,so don't use this format");
      return `https://tva${randomServer}.sinaimg.cn/` + size + "/" + img;
    }
  };
  if (count && count > 1) {
    let shuffled = image_list.slice(0);
    while (shuffled.length <= 6) {
      shuffled = shuffled.concat(image_list.slice(0));
    }
    i = shuffled.length;
    const min = i - count;
    let temp;
    let index;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min).map(function(img) {
      return parseImage(img, "large");
    });
  }
  return parseImage(image_list[Math.floor(Math.random() * image_list.length)], "mw690");
};
hexo.extend.helper.register("preloadjs", function() {
  const { statics, js } = hexo.theme.config;
  let res = "";
  import_node_fs.default.readdirSync("./shokaxTemp").forEach((file) => {
    if (file.endsWith(".js")) {
      res += (0, import_hexo_util.htmlTag)("link", { rel: "modulepreload", href: import_hexo_util.url_for.call(this, `${statics}${js}/${file}`) }, "");
    }
  });
  return res;
});
hexo.extend.helper.register("load_async_css", function() {
  const { statics, css } = hexo.theme.config;
  let res = "";
  import_node_fs.default.readdirSync("./shokaxTemp").forEach((file) => {
    if (file.endsWith(".css")) {
      res += (0, import_hexo_util.htmlTag)("link", { rel: "stylesheet", href: import_hexo_util.url_for.call(this, `${statics}${css}/${file}`), media: "none", onload: "this.media='all'" }, "");
    }
  });
  return res;
});
hexo.extend.helper.register("_url", function(path, text, options = {}) {
  if (!path) {
    return;
  }
  let tag = "a";
  let attrs = { href: import_hexo_util.url_for.call(this, path), class: void 0, external: void 0, rel: void 0, "data-url": void 0 };
  for (const key in options) {
    attrs[key] = options[key];
  }
  if (attrs.class && Array.isArray(attrs.class)) {
    attrs.class = attrs.class.join(" ");
  }
  return (0, import_hexo_util.htmlTag)(tag, attrs, decodeURI(text), false);
});
hexo.extend.helper.register("_image_url", function(img, path = "") {
  const { statics } = hexo.theme.config;
  const { post_asset_folder } = hexo.config;
  if (img.startsWith("//") || img.startsWith("http")) {
    return img;
  } else {
    return import_hexo_util.url_for.call(this, statics + (post_asset_folder ? path : "") + img);
  }
});
hexo.extend.helper.register("_cover", function(item, num) {
  const { image_server, image_list } = hexo.theme.config;
  if (item.cover) {
    return this._image_url(item.cover, item.path);
  } else if (item.photos && item.photos.length > 0) {
    return this._image_url(item.photos[0], item.path);
  } else {
    return randomBG(num || 1, image_server, image_list);
  }
});
hexo.extend.helper.register("_cover_index", function(item) {
  const { index_images, image_list, image_server } = hexo.theme.config;
  if (item.cover) {
    return this._image_url(item.cover, item.path);
  } else if (item.photos && item.photos.length > 0) {
    return this._image_url(item.photos[0], item.path);
  } else {
    return randomBG(6, image_server, index_images.length === 0 ? image_list : index_images);
  }
});
hexo.extend.helper.register("_permapath", function(str) {
  const { permalink } = hexo.config;
  let url = str.replace(/index\.html$/, "");
  if (!permalink.endsWith(".html")) {
    url = url.replace(/\.html$/, "");
  }
  return url;
});
hexo.extend.helper.register("canonical", function() {
  return `<link rel="canonical" href="${this._permapath(this.url)}">`;
});
hexo.extend.helper.register("i18n_path", function(language) {
  const { path, lang } = this.page;
  const base = path.startsWith(lang) ? path.slice(lang.length + 1) : path;
  return import_hexo_util.url_for.call(this, `${this.languages.indexOf(language) === 0 ? "" : "/" + language}/${base}`);
});
hexo.extend.helper.register("language_name", function(language) {
  const name = hexo.theme.i18n.__(language)("name");
  return name === "name" ? language : name;
});
hexo.extend.helper.register("random_color", function() {
  const arr = [];
  for (let i = 0; i < 3; i++) {
    arr.push(Math.floor(Math.random() * 128 + 128));
  }
  const [r, g, b] = arr;
  return `#${r.toString(16).length > 1 ? r.toString(16) : "0" + r.toString(16)}${g.toString(16).length > 1 ? g.toString(16) : "0" + g.toString(16)}${b.toString(16).length > 1 ? b.toString(16) : "0" + b.toString(16)}`;
});
hexo.extend.helper.register("shokax_inject", function(point) {
  return hexo.theme.config.injects[point].map((item) => this.partial(item.layout, item.locals, item.options)).join("");
});
