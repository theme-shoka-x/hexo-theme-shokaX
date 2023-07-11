const statics = CONFIG.statics.indexOf('//') > 0 ? CONFIG.statics : CONFIG.root
const scrollAction: { x: number, y: number } = { x: 0, y: 0 }
let diffY = 0
let originTitle: string, titleTime: NodeJS.Timeout
const BODY = document.getElementsByTagName('body')[0]
const HTML = document.documentElement
const Container = $dom('#container')
const loadCat = $dom('#loading')
const siteNav = $dom('#nav')
const siteHeader = $dom('#header')
const menuToggle = siteNav.child('.toggle')
const quickBtn = $dom('#quick')
const sideBar = $dom('#sidebar')
const siteBrand = $dom('#brand')
let toolBtn = $dom('#tool')
let toolPlayer
let backToTop: HTMLElement
let goToComment
let showContents
let siteSearch = $dom('#search')
let siteNavHeight: number, headerHightInner: number, headerHight: number
let oWinHeight = window.innerHeight
let oWinWidth = window.innerWidth
let LOCAL_HASH = 0
let LOCAL_URL = window.location.href
let pjax
