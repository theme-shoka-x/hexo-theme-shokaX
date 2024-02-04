import anime from 'theme-shokax-anime'
import { siteNavHeight } from '../globals/globalVars'
import type { AnimeOptions } from 'theme-shokax-anime/dist/types'
import {getTop, setDisplay} from './proto'

/**
 * 参数  动画效果
 * 0  元素逐渐消失
 * 1  元素逐渐出现
 * bounceUpIn  元素从下方弹跳出现
 * shrinkIn  元素从放大到正常大小出现
 * slideRightIn  元素从右侧滑入
 * slideRightOut  元素向右侧滑出
 * TODO 函数功能过于复杂，需要拆分
 */
export const transition = (target: HTMLElement, type: number|string|Function, complete?: Function, begin?: Function): void => {
  let animation:Partial<AnimeOptions>
  let display = 'none'
  switch (type) {
    case 0:
      animation = { opacity: [1, 0] }
      break
    case 1:
      animation = { opacity: [0, 1] }
      display = 'block'
      break
    case 'bounceUpIn':
      animation = {
        begin (anim) {
          setDisplay(target, 'block')
        },
        translateY: [
          { value: -60, duration: 200 },
          { value: 10, duration: 200 },
          { value: -5, duration: 200 },
          { value: 0, duration: 200 }
        ],
        opacity: [0, 1]
      }
      display = 'block'
      break
    case 'shrinkIn':
      animation = {
        begin (anim) {
          setDisplay(target, 'block')
        },
        scale: [
          { value: 1.1, duration: 300 },
          { value: 1, duration: 200 }
        ],
        opacity: 1
      }
      display = 'block'
      break
    case 'slideRightIn':
      animation = {
        begin (anim) {
          setDisplay(target, 'block')
        },
        translateX: ['100%', '0%'],
        opacity: [0, 1]
      }
      display = 'block'
      break
    case 'slideRightOut':
      animation = {
        translateX: ['0%', '100%'],
        opacity: [1, 0]
      }
      break
    default:
      // @ts-ignore
      animation = type
      // @ts-ignore
      display = type.display
      break
  }
  anime(Object.assign({
    targets: target,
    duration: 200,
    easing: 'linear',
    begin () {
      begin && begin()
    },
    complete () {
      setDisplay(target, display)
      complete && complete()
    }
  }, animation)).play()
}

export const pageScroll = (target: HTMLElement|number, offset?: number, complete?: Function) => {
  // target: 滚动到的目标元素或坐标(number)
  // offset: 可选的偏移量
  // complete: 可选的回调函数，在动画完成时调用
  anime({
    // 动画目标
    targets: typeof offset === 'number' && typeof target !== 'number' ? target.parentNode : document.scrollingElement,
    // 动画持续时间
    duration: 500,
    // 动画缓动函数
    easing: 'easeInOutQuad',
    // 如果 offset 存在，则滚动到 offset，如果 target 是数字，则滚动到 target，如果 target 是 DOM 元素，则滚动到下述表达式
    scrollTop: offset || (typeof target === 'number' ? target : (target ? getTop(target) + document.documentElement.scrollTop - siteNavHeight : 0)),
    // 完成回调函数
    complete () {
      complete && complete()
    }
  }).play()
}
