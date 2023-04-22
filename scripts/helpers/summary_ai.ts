import fs from 'node:fs'

function getContent (post) {
  return post?.raw ?? post?._content ?? post.content
}

let db:object

function getSummary (path:string, content?:string):string {
  if (fs.existsSync('summary.json')) {
    // @ts-ignore
    db = JSON.parse(fs.readFileSync('summary.json') as string)
  } else {
    db = {}
  }
  const config = hexo.theme.config.summary
  if (config.enable) {
    if (typeof db?.[path] !== 'undefined') {
      return db[path].summary
    } else {
      db[path] = {}
    }
    if (config.mode === 'openai') {
      const requestHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.openai.apikey}`
      }
      const requestBody = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `请为下述文章提供一份200字以内的概括，使用中文回答且尽可能简洁: ${content}` }],
        temperature: 0.7
      }
      fetch(`${config.openai.remote}/v1/chat/completions`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(requestBody)
      }).then((response) => {
        if (!response.ok) {
          throw Error('ERROR: Failed to get summary from Openai API')
        }
        response.json().then((data:object) => {
          // @ts-ignore
          const summary = data.choices[0].message.content
          db[path].summary = summary
          fs.writeFileSync('summary.json', JSON.stringify(db))
          return summary
        })
      })
    } else {
      // custom尚未支持
    }
  }
}

hexo.extend.helper.register('get_summary', (post) => {
  return getSummary(post.path, getContent(post))
})
