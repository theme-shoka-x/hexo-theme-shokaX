const { describe, beforeEach, afterEach, it } = require('mocha')
const jsdom = require('jsdom')
const { $dom } = require('../source/js/_app/library/dom')
const { expect } = require('chai')

describe('$dom', function () {
  // 在每个测试用例之前创建一个虚拟文档
  beforeEach(function () {
    const html = `
      <html lang="zh-cn">
        <head><title>Test Page</title></head>
        <body>
          <div id="container">
            <p class="text">Hello</p>
            <p class="text">World</p>
          </div>
        </body>
      </html>
    `
    const dom = new jsdom.JSDOM(html)
    global.document = dom.window.document
    global.HTMLElement = dom.window.HTMLElement
  })

  // 在每个测试用例之后清除虚拟文档
  afterEach(function () {
    global.document = null
  })

  it('should return the element with the given id selector', function () {
    const element = $dom('#container')
    expect(element).to.exist
    expect(element).to.be.instanceOf(HTMLElement)
    expect(element.id).to.equal('container')
  })

  it('should return the first element that matches the given selector', function () {
    const element = $dom('.text')
    expect(element).to.exist
    expect(element).to.be.instanceOf(HTMLElement)
    expect(element.textContent).to.equal('Hello')
  })

  it('should return null if no element matches the given selector', function () {
    const element = $dom('.foo')
    expect(element).to.be.null
  })
})
