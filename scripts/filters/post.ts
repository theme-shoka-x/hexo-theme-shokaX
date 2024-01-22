/* global hexo */

hexo.extend.filter.register('after_post_render', (data) => {
  // 使用正则表达式将<img>标签的src属性替换为data-src属性
  data.content = data.content.replace(/(<img[^>]*) src=/img, '$1 loading="lazy" data-src=')
}, 0)
