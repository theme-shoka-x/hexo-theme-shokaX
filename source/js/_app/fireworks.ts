/*
*  烟花分区
*/
declare interface fireworksP {
  x: number,
  y: number,
  color: string,
  radius: any,
  endPos: any,
  alpha?: number,
  lineWidth?: number,
  draw: any
}

// 使用 document.createElement() 创建了一个 canvas 元素，并将它赋值给变量 canvasEl
const canvasEl = document.createElement('canvas')
// 为 canvasEl 元素添加样式，设置固定位置为顶部左边，禁止鼠标事件，层级最高
canvasEl.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9999999'
document.body.appendChild(canvasEl)
// 获取 canvasEl 的 2D 绘图上下文，并赋值给 ctx
const ctx = canvasEl.getContext('2d')
// 设置烟花粒子的数量
const numberOfParticules = 30
// 初始化鼠标指针的 x 坐标和 y 坐标
let pointerX = 0
let pointerY = 0
const tap = 'click' // ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown'
// 从配置文件中获取烟花的颜色
const colors = CONFIG.fireworks

// 这个函数设置 canvas 元素的大小
function setCanvasSize ():void {
  // 设置 canvas 元素的宽高度为窗口宽高的两倍
  canvasEl.width = window.innerWidth * 2
  canvasEl.height = window.innerHeight * 2
  // 设置 canvas 元素的样式宽高为窗口宽高
  canvasEl.style.width = window.innerWidth + 'px'
  canvasEl.style.height = window.innerHeight + 'px'
  // 对 canvas 元素的 2D 上下文进行缩放，将宽高都缩放为原来的两倍
  canvasEl.getContext('2d').scale(2, 2)
}

// 更新鼠标/触摸坐标
function updateCoords (e: any):void {
  // 获取鼠标的 x 坐标，如果是移动端设备，则获取触摸点的 x 坐标
  pointerX = e.clientX || (e.touches && e.touches[0].clientX)
  // 获取鼠标的 y 坐标，如果是移动端设备，则获取触摸点的 y 坐标
  pointerY = e.clientY || (e.touches && e.touches[0].clientY)
}

// 设置烟花粒子的运动方向
function setParticuleDirection (p:fireworksP):Object {
  // 使用 anime.random() 随机生成一个 0 到 360 的角度
  const angle = anime.random(0, 360) * Math.PI / 180
  // 使用 anime.random() 随机生成一个 50 到 180 的值
  const value:number = anime.random(50, 180)
  // 使用 anime.random() 随机生成一个 -1 或 1，并乘以 value
  const radius = [-1, 1][anime.random(0, 1)] * value
  // 返回烟花粒子运动的 x 坐标和 y 坐标
  return {
    x: p.x + radius * Math.cos(angle),
    y: p.y + radius * Math.sin(angle)
  }
}

// 创建一个烟花粒子
function createParticule (x:number, y:number):fireworksP {
  const p = {
    x: undefined,
    y: undefined,
    color: undefined,
    radius: undefined,
    endPos: undefined,
    draw: undefined
  }
  // 将传入的坐标赋值给p
  p.x = x
  p.y = y
  // 从colors中随机选取一种颜色赋值给p.color
  p.color = colors[anime.random(0, colors.length - 1)]
  // 使用 anime.random() 随机生成烟花粒子的半径，范围在16~32之间
  p.radius = anime.random(16, 32)
  // 使用 setParticuleDirection() 方法来设置烟花粒子的终点坐标
  p.endPos = setParticuleDirection(p)
  // 绘制烟花粒子
  p.draw = function () {
    // 绘制圆，参数分别为圆心x坐标，圆心y坐标，半径，开始角度，结束角度，顺时针/逆时针
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true)
    ctx.fillStyle = p.color
    ctx.fill()
  }
  return p
}

// 创建一个圆形
function createCircle (x:number, y:number):fireworksP {
  const p = {
    x: undefined,
    y: undefined,
    color: undefined,
    radius: undefined,
    endPos: undefined,
    alpha: undefined,
    lineWidth: undefined,
    draw: undefined
  }
  // 将传入的坐标赋值给p
  p.x = x
  p.y = y
  // 将颜色设置为白色
  p.color = '#FFF'
  p.radius = 0.1
  p.alpha = 0.5
  p.lineWidth = 6
  // 绘制圆形
  p.draw = function () {
    // 设置全局透明度为p.alpha
    ctx.globalAlpha = p.alpha
    ctx.beginPath()
    // 绘制圆，参数分别为圆心x坐标，圆心y坐标，半径，开始角度，结束角度，顺时针/逆时针
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true)
    // 设置线宽
    ctx.lineWidth = p.lineWidth
    ctx.strokeStyle = p.color
    ctx.stroke()
    // 恢复全局透明度为1
    ctx.globalAlpha = 1
  }
  return p
}

// 渲染烟花粒子
function renderParticule (anim:any):void {
  // 遍历所有可动画的对象
  for (let i = 0; i < anim.animatables.length; i++) {
    // 调用对象上的draw函数来绘制烟花粒子
    anim.animatables[i].target.draw()
  }
}

// 动画烟花粒子
function animateParticules (x:number, y:number):void {
  // 创建一个圆形
  const circle = createCircle(x, y)
  // 创建一个空数组用于存储烟花粒子
  const particules = []
  // 循环创建烟花粒子
  for (let i = 0; i < numberOfParticules; i++) {
    particules.push(createParticule(x, y))
  }
  // 创建一个 anime.js 的时间线，并添加动画
  anime.timeline().add({
    targets: particules,
    // x 坐标移动到烟花粒子的终点坐标
    x: function (p) {
      return p.endPos.x
    },
    // y 坐标移动到烟花粒子的终点坐标
    y: function (p) {
      return p.endPos.y
    },
    // 半径变为0.1
    radius: 0.1,
    // 动画持续时间为 anime.random(1200, 1800)
    duration: anime.random(1200, 1800),
    // 动画缓动效果为 easeOutExpo
    easing: 'easeOutExpo',
    // 更新渲染函数
    update: renderParticule
  }).add({
    targets: circle,
    // 圆形半径变为 anime.random(80, 160)
    radius: anime.random(80, 160),
    lineWidth: 0,
    // 透明度变化，最终值为0
    alpha: {
      value: 0,
      easing: 'linear',
      // 持续时间为 anime.random(600, 800)
      duration: anime.random(600, 800)
    },
    duration: anime.random(1200, 1800),
    easing: 'easeOutExpo',
    // 更新渲染函数
    update: renderParticule
  }, 0)
}

const render = anime({
  // anime.js 的参数对象
  duration: Infinity,
  // 动画持续时间，设置为 Infinity 表示动画永远不会结束
  update: function () {
    // 每帧更新时执行的函数
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
    // 清除画布上的矩形区域，这里清除整个画布
  }
})

document.addEventListener(tap, function (e) {
  render.play()
  updateCoords(e)
  animateParticules(pointerX, pointerY)
}, false)

setCanvasSize()
window.addEventListener('resize', setCanvasSize, false)
