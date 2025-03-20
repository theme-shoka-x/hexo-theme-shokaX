hexo.extend.generator.register("pages", function() {
  const config = hexo.config;
  return [
    {
      path: config.category_dir + "/index.html",
      data: { type: "categories" },
      layout: "page"
    },
    {
      path: config.tag_dir + "/index.html",
      data: { type: "tags" },
      layout: "page"
    }
  ];
});
