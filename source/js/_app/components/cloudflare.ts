// rocket-loader & Auto minify(cloudflare) 补丁
// cloudflare 的上述功能会导致DOMContentLoaded事件无法触发，此补丁会将DOMContentLoaded重定向为load事件
export function cloudflareInit () {
  let inCloudFlare = true
  window.addEventListener('DOMContentLoaded', function () {
    inCloudFlare = false
  })

  if (document.readyState === 'loading') {
    window.addEventListener('load', function () {
      if (inCloudFlare) {
        window.dispatchEvent(new Event('DOMContentLoaded'))
        console.log('%c ☁️cloudflare patch ' + '%c running', 'color: white; background: #ff8c00; padding: 5px 3px;', 'padding: 4px;border:1px solid #ff8c00')
      }
    })
  }
}

cloudflareInit()