import fs from 'node:fs'

function getContent (post) {
  return post?.raw ?? post?._content ?? post.content
}

let db:object
function postMessage (path:string, content:string, dbPath:string, startMessage:string) {
  if (fs.existsSync('summary.json')) {
    // @ts-ignore
    db = JSON.parse(fs.readFileSync('summary.json', { encoding: 'utf-8' }))
  } else {
    db = {}
  }
  const config = hexo.theme.config.summary
  if (config.enable) {
    if (typeof db?.[path] !== 'undefined' && typeof db?.[path]?.[dbPath] !== 'undefined') {
      return db[path][dbPath]
    } else {
      if (typeof db?.[path] === 'undefined') {
        db[path] = {}
      } else {
        db[path][dbPath] = ''
      }
    }
    if (config.mode === 'openai') {
      const request = () => {
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
            try {
              db[path][dbPath] = summary
            } catch (e) {
              db ??= {}
              db[path] ??= {}
              db[path][dbPath] ??= ''
              db[path][dbPath] = summary
            }
            fs.writeFileSync('summary.json', JSON.stringify(db))
            if (fs.existsSync('requested.lock')) {
              fs.unlinkSync('requested.lock')
            }
            return summary
          })
        })
      }

      const checkTime = (waitTime:number) => {
        if (fs.existsSync('request.lock')) {
          if (fs.existsSync('requested.lock')) {
            setTimeout(checkTime, 1000 * waitTime)
            return
          }
          // Openai API 针对个人用户免费试用限制 3 RPM，这里是25s后发送请求
          fs.writeFileSync('requested.lock', '')
          setTimeout(request, 1000 * 2.5 * waitTime)
          fs.unlinkSync('request.lock')
        } else {
          fs.writeFileSync('request.lock', '')
          request()
        }
      }
      const requestHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.openai.apikey}`
      }
      const requestBody = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `${startMessage} ${content}` }],
        temperature: 0.7
      }
      if (config.pricing === 'trial') {
        hexo.log.info('Requesting OpenAI API... (3 RPM mode)')
        hexo.log.info('It may take 20 minutes or more (depending on the number of articles, each one takes 25 seconds)')
        checkTime(10)
      } else {
        hexo.log.info('Requesting OpenAI API... (60 RPM mode)')
        checkTime(0.5)
      }
    } else {
      // custom尚未支持
    }
  }
}

hexo.extend.helper.register('get_summary', (post) => {
  return postMessage(post.path, getContent(post), 'summary', '请为下述文章提供一份200字以内的概括，使用中文回答且尽可能简洁: ')
})

hexo.extend.helper.register('get_introduce', () => {
  return hexo.theme.config.summary.introduce
})
