let findProblem = false;
hexo.on("generateBefore", function() {
  if (hexo.config.syntax_highlighter) {
    findProblem = true;
    hexo.log.error("[SXEC 101] Highlight.js or Prismjs enabled. The code block will render incomplete");
  }
  if (!hexo.config.markdown) {
    findProblem = true;
    hexo.log.error(`[SXEC 102] Critical rendering plugins are missing or incorrectly configured. 
Some features will be disabled or render incorrectly`);
  }
  if (parseInt(process.version.match(/\d{2,3}/)[0]) < 18) {
    findProblem = true;
    hexo.log.error("[SXEC 103] Too old Node.js version, install the latest LTS version");
  }
  if (!hexo.config.title || !hexo.config.description || !hexo.config.language || !hexo.config.timezone || !hexo.config.url) {
    findProblem = true;
    hexo.log.warn("[SXEC 201] Essential information(title, desc, lang, etc) config incorrectly, Page will render incorrectly");
  }
  if (hexo.theme.config.gitalk?.clientID || hexo.theme.config.giscus?.repo) {
    findProblem = true;
    hexo.log.warn("[SXEC 202] You are using an deprecated feature and it was removed in the v0.3.10");
  }
});
hexo.on("generateAfter", function() {
  if (findProblem) {
    hexo.log.warn(`The environment check found some problems that can lead to rendering errors, effect errors, 
performance degradation, not working correctly, etc`);
    hexo.log.warn("ShokaX has output them into console, read them to get more information. You can search error code in docs(For example, SXEC 101)");
  }
});
