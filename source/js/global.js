/* global CONFIG */
const statics = CONFIG.statics.indexOf('//') > 0 ? CONFIG.statics : CONFIG.root
const scrollAction = { x: 'undefined', y: 'undefined' }
let diffY = 0
let originTitle, titleTime
