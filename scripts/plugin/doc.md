# shokaX-plugins设计文档
**警告: 目前为止插件系统仍处于开发期,所有特性均可能被更改或移除**

## 插件结构
插件应为一个标准NPM包以便发布 \
应有一个js文件(index.js)并有`main`函数,`main`函数应有三个参数,对应关系如下:
```javascript
function main(hexo,_this,tools){
    // hexo即为插件开发中常用的hexo,可以进行访问配置、注册helper等操作
	// _this即为hexoScript中的this,用于访问工具函数
	// tools即为shokaX插件工具包,见下文
}
```

## 工具包
**尚未开发完成**
工具包将会包含如下函数:
### insert函数系列
```javascript
tools.insert('footer',"<p>This is text</p>") //向footer注入html 
tools.insertCss('body {background-color:#114514;}') //向head注入css
tools.insertJs('head',"alert('hello world')") //向head注入js
```
所有的insert函数均使用helper注入 \
`insert`的type:
- `header`: 注入到导航栏右侧
- `footer-post`: 注入到文章底部
- `footer`: 注入到页面底部
- `sidebar`: 注入到边栏

`insertJs`的type:
- `head`: 注入到页面的`</head>`之前(shokaX`app.js`中的函数无法使用)
- `layout`: 注入到`app.js`之后
