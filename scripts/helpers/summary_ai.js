hexo.extend.helper.register("get_summary", (post) => {
  return post.summary;
});
hexo.extend.helper.register("get_introduce", () => {
  return hexo.theme.config.summary.introduce;
});
