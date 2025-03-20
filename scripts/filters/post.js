hexo.extend.filter.register("after_post_render", (data) => {
  data.content = data.content.replace(/(<img[^>]*) src=/img, '$1 loading="lazy" data-src=');
}, 0);
