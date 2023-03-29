/* global hexo */

// @ts-ignore
const fmtNum = (num) => {
  return num < 10 ? '0' + num : num
}

// TODO 重写一个接口以适应shoka的locals写法
hexo.extend.filter.register('template_locals', (locals:any) => {
  const { config } = hexo
  const { __, theme } = locals
  // @ts-ignore
  const { i18n } = hexo.theme

  const pangu = theme.pangu
    ? require('pangu')
    : {
        spacing: (data) => {
          return data
        }
      }

  // Language & Config
  locals.alternate = theme.alternate
  locals.title = pangu.spacing(__('title') !== 'title' ? __('title') : config.title)
  locals.subtitle = pangu.spacing(__('subtitle') !== 'subtitle' ? __('subtitle') : config.subtitle)
  locals.author = __('author') !== 'author' ? __('author') : config.author
  locals.description = pangu.spacing(__('description') !== 'description' ? __('description') : config.description)
  locals.languages = [...i18n.languages]
  locals.languages.splice(locals.languages.indexOf('default'), 1)
  locals.page.lang = locals.page.lang || locals.page.language
  locals.hostname = new URL(config.url).hostname || config.url

  // Creative Commons
  if (theme.creative_commons.license === 'zero') {
    locals.ccURL = 'https://creativecommons.org/' + 'publicdomain/zero/1.0/' + (theme.creative_commons.language || '')
  } else {
    locals.ccURL = 'https://creativecommons.org/' + 'licenses/' + theme.creative_commons.license + '/4.0/' + (theme.creative_commons.language || '')
  }

  if (locals.page.title) {
    locals.page.title = pangu.spacing(locals.page.title)
  }
  locals.page.lastcat = ''
  if (locals.page.categories) {
    locals.page.categories.map((cat) => {
      if (cat.name) {
        cat.name = locals.page.lastcat = pangu.spacing(cat.name)
      }
      return cat
    })
  }

  if (locals.page.category) {
    locals.page.title = pangu.spacing(locals.page.category)
  }

  if (locals.page.month) {
    locals.page.month = fmtNum(locals.page.month)
  }
})
