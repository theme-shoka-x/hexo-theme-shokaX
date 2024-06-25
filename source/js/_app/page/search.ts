import { BODY, CONFIG, setSiteSearch, siteSearch } from '../globals/globalVars'
import { transition } from '../library/anime'
import { $dom } from '../library/dom'
import { searchBox, configure, stats, hits, pagination } from 'instantsearch.js/es/widgets'
import type { HitHighlightResult } from 'instantsearch.js/es/types/results'
import instantsearch from 'instantsearch.js'
import algoliasearch from 'algoliasearch/lite'

export function algoliaSearch (pjax) {
  const search = instantsearch({
    indexName: CONFIG.search.indexName,
    searchClient: algoliasearch(CONFIG.search.appID, CONFIG.search.apiKey),
    // TODO 移除弃用函数
    searchFunction (helper) {
      const searchInput = document.querySelector('.search-input') as HTMLInputElement
      if (searchInput.value) {
        helper.search()
      }
    }
  })

  search.on('render', () => {
    pjax.refresh(document.getElementById("search-hits"))
  })

  // Registering Widgets
  search.addWidgets([
    configure({
      hitsPerPage: CONFIG.search.hits.per_page || 10
    }),

    searchBox({
      container: '.search-input-container',
      placeholder: LOCAL.search.placeholder,
      // Hide default icons of algolia search
      showReset: false,
      showSubmit: false,
      showLoadingIndicator: false,
      cssClasses: {
        input: 'search-input'
      }
    }),

    stats({
      container: '#search-stats',
      templates: {
        text (data) {
          const stats = LOCAL.search.stats
            .replace(/\$\{hits}/, data.nbHits.toString())
            .replace(/\$\{time}/, data.processingTimeMS.toString())
          return stats + '<span class="algolia-powered"></span><hr>'
        }
      }
    }),

    hits({
      container: '#search-hits',
      templates: {
        item (data) {
          const cats = data.categories ? '<span>' + data.categories.join('<i class="ic i-angle-right"></i>') + '</span>' : ''
          return '<a href="' + CONFIG.root + data.path + '">' + cats + (data._highlightResult.title as HitHighlightResult).value + '</a>'
        },
        empty (data) {
          return '<div id="hits-empty">' +
            LOCAL.search.empty.replace(/\$\{query}/, data.query) +
            '</div>'
        }
      },
      cssClasses: {
        item: 'item'
      }
    }),

    pagination({
      container: '#search-pagination',
      scrollTo: false,
      showFirst: false,
      showLast: false,
      templates: {
        first: '<i class="ic i-angle-double-left"></i>',
        last: '<i class="ic i-angle-double-right"></i>',
        previous: '<i class="ic i-angle-left"></i>',
        next: '<i class="ic i-angle-right"></i>'
      },
      cssClasses: {
        root: 'pagination',
        item: 'pagination-item',
        link: 'page-number',
        selectedItem: 'current',
        disabledItem: 'disabled-item'
      }
    })
  ])

  search.start()

  // Monitor main search box
  const onPopupClose = () => {
    document.body.style.overflow = ''
    transition(siteSearch, 0) // "transition.shrinkOut"
  }

  siteSearch.addEventListener('click', (event) => {
    if (event.target === siteSearch) {
      onPopupClose()
    }
  })
  document.querySelector('.close-btn').addEventListener('click', onPopupClose)
  window.addEventListener('pjax:success', onPopupClose)
  window.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
      onPopupClose()
    }
  })
}
