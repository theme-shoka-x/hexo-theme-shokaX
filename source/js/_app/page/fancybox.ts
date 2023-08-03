import { $dom } from '../library/dom'
import { vendorCss, vendorJs } from '../library/loadFile'

export const postFancybox = (p:string) => {
  if ($dom(p + ' .md img')) {
    vendorCss('fancybox')
    vendorJs('fancybox', () => {
      const q = jQuery.noConflict()

      $dom.each(p + ' p.gallery', (element) => {
        const box = document.createElement('div')
        box.className = 'gallery'
        box.attr('data-height', String(element.attr('data-height') || 220))

        box.innerHTML = element.innerHTML.replace(/<br>/g, '')

        element.parentNode.insertBefore(box, element)
        element.remove()
      })

      $dom.each(p + ' .md img:not(.emoji):not(.vemoji)', (element) => {
        const $image = q(element)
        const imageLink = $image.attr('data-src') || $image.attr('src') // 替换
        const $imageWrapLink = $image.wrap('<a class="fancybox" href="' + imageLink + '" itemscope itemtype="https://schema.org/ImageObject" itemprop="url"></a>').parent('a')
        let info; let captionClass = 'image-info'
        if (!$image.is('a img')) {
          $image.data('safe-src', imageLink)
          if (!$image.is('.gallery img')) {
            $imageWrapLink.attr('data-fancybox', 'default').attr('rel', 'default')
          } else {
            captionClass = 'jg-caption'
          }
        }
        if ((info = element.attr('title'))) {
          $imageWrapLink.attr('data-caption', info)
          const para = document.createElement('span')
          const txt = document.createTextNode(info)
          para.appendChild(txt)
          para.addClass(captionClass)
          element.insertAfter(para)
        }
      })

      $dom.each(p + ' div.gallery', (el, i) => {
        // @ts-ignore
        q(el).justifiedGallery({
          rowHeight: q(el).data('height') || 120,
          rel: 'gallery-' + i
        }).on('jg.complete', function () {
          q(this).find('a').each((k, ele) => {
            ele.attr('data-fancybox', 'gallery-' + i)
          })
        })
      })

      q.fancybox.defaults.hash = false
      q(p + ' .fancybox').fancybox({
        loop: true,
        // @ts-ignore
        helpers: {
          overlay: {
            locked: false
          }
        }
      })
      // @ts-ignore
    }, window.jQuery)
  }
}
