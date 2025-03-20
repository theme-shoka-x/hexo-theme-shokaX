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
var import_hexo_pagination = __toESM(require("hexo-pagination"));
const fmtNum = (num) => {
  return num < 10 ? "0" + num : num;
};
if (!(hexo.config.archive && hexo.config.archive.enabled === false)) {
  let per_page;
  if (hexo.config.archive === 1) {
    per_page = 0;
  } else if (typeof hexo.config.per_page === "undefined") {
    per_page = 10;
  } else {
    per_page = hexo.config.per_page;
  }
  hexo.config.archive_generator = Object.assign({
    per_page,
    yearly: true,
    monthly: true,
    daily: false
  }, hexo.config.archive_generator);
  hexo.extend.generator.register("archive", function(locals) {
    const config = hexo.config;
    let archiveDir = config.archive_dir;
    const paginationDir = config.pagination_dir || "page";
    const allPosts = locals.posts.sort(config.archive_generator.order_by || "-date");
    const perPage = config.archive_generator.per_page;
    let result = [];
    if (!allPosts.length) return;
    if (archiveDir[archiveDir.length - 1] !== "/") archiveDir += "/";
    function generate(path, posts2, options) {
      options = options || {};
      options.archive = true;
      result = result.concat((0, import_hexo_pagination.default)(path, posts2, {
        perPage: path === archiveDir ? 0 : perPage,
        layout: ["archive", "index"],
        format: paginationDir + "/%d/",
        data: options
      }));
    }
    generate(archiveDir, allPosts);
    if (!config.archive_generator.yearly) return result;
    const posts = {};
    allPosts.forEach((post) => {
      const date = post.date;
      const year2 = date.year();
      const month2 = date.month() + 1;
      if (!Object.prototype.hasOwnProperty.call(posts, year2)) {
        posts[year2] = [
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          []
        ];
      }
      posts[year2][0].push(post);
      posts[year2][month2].push(post);
      if (config.archive_generator.daily) {
        const day = date.date();
        if (!Object.prototype.hasOwnProperty.call(posts[year2][month2], "day")) {
          posts[year2][month2].day = {};
        }
        (posts[year2][month2].day[day] || (posts[year2][month2].day[day] = [])).push(post);
      }
    });
    const Query = this.model("Post").Query;
    const years = Object.keys(posts);
    let year, data, month, monthData, url;
    for (let i = 0, len = years.length; i < len; i++) {
      year = +years[i];
      data = posts[year];
      url = archiveDir + year + "/";
      if (!data[0].length) continue;
      generate(url, new Query(data[0]), { year });
      if (!config.archive_generator.monthly && !config.archive_generator.daily) continue;
      for (month = 1; month <= 12; month++) {
        monthData = data[month];
        if (!monthData.length) continue;
        if (config.archive_generator.monthly) {
          generate(url + fmtNum(month) + "/", new Query(monthData), {
            year,
            month
          });
        }
        if (!config.archive_generator.daily) continue;
        for (let day = 1; day <= 31; day++) {
          const dayData = monthData.day[day];
          if (!dayData || !dayData.length) continue;
          generate(url + fmtNum(month) + "/" + fmtNum(day) + "/", new Query(dayData), {
            year,
            month,
            day
          });
        }
      }
    }
    return result;
  });
}
