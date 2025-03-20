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
var import_node_crypto = require("node:crypto");
var import_promises = __toESM(require("node:fs/promises"));
async function getSummaryByAPI(content) {
  const apiKey = hexo.theme.config.summary.apiKey;
  const apiUrl = hexo.theme.config.summary.apiUrl;
  const model = hexo.theme.config.summary.model;
  const temperature = hexo.theme.config.summary.temperature ?? 1.3;
  const initalPrompt = hexo.theme.config.summary.initalPrompt;
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [{
        role: "system",
        content: `${initalPrompt}`
      }, {
        role: "user",
        content: `${content}`
      }],
      temperature
    })
  });
  if (!res.ok) {
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (data.error) {
    throw new Error(`Error: ${data.error.message}`);
  }
  const summary = data.choices[0].message.content;
  return summary;
}
class SummaryDatabase {
  fileChanged;
  data;
  constructor() {
    this.fileChanged = false;
    this.data = {
      version: 2,
      features: {
        incremental: false
      },
      summaries: {}
    };
  }
  async readDB() {
    try {
      await import_promises.default.access("summary.json");
      this.data = JSON.parse(await import_promises.default.readFile("summary.json", "utf-8"));
    } catch (error) {
    }
    if (this.data.version !== 2) {
      throw new Error(`Incompatible version of summary database: ${this.data.version}`);
    }
  }
  async writeDB() {
    if (this.fileChanged) {
      await import_promises.default.writeFile("summary.json", JSON.stringify(this.data));
    }
  }
  async getPostSummary(path, content) {
    const pathHash = (0, import_node_crypto.createHash)("sha256").update(path).digest("hex");
    const contentHash = (0, import_node_crypto.createHash)("sha256").update(content).digest("hex");
    if (this.data.summaries[pathHash]?.sha256 === contentHash) {
      return this.data.summaries[pathHash].summary;
    } else {
      const summaryContent = await getSummaryByAPI(content);
      this.data.summaries[pathHash] = {
        summary: summaryContent,
        sha256: contentHash
      };
      this.fileChanged = true;
      return summaryContent;
    }
  }
}
hexo.extend.generator.register("summary_ai", async function(locals) {
  const posts = locals.posts;
  if (!hexo.theme.config.summary.enable) {
    return;
  }
  const db = new SummaryDatabase();
  await db.readDB();
  const postArray = posts.toArray();
  const pLimit = require("@common.js/p-limit").default;
  const concurrencyLimit = pLimit(hexo.theme.config.summary?.concurrency || 5);
  const processingPromises = postArray.map((post) => concurrencyLimit(async () => {
    const content = post.content;
    const path = post.path;
    const published = post.published;
    if (content && path && published && content.length > 0) {
      try {
        const summary = await db.getPostSummary(path, content);
        post.summary = summary;
      } catch (error) {
        hexo.log.error(`[ShokaX Summary AI] \u5904\u7406\u6587\u7AE0 ${path} \u65F6\u51FA\u9519:`, error.message);
        post.summary = `${error.message}`;
      }
    }
  }));
  await Promise.all(processingPromises);
  await db.writeDB();
  hexo.log.info(`[ShokaX Summary AI] \u6240\u6709\u6587\u7AE0\u6458\u8981\u5904\u7406\u5B8C\u6210\uFF0C\u5DF2\u4FDD\u5B58\u5230\u6570\u636E\u5E93`);
});
