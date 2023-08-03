import { BODY, setSiteSearch, siteSearch } from '../globals/globalVars'
import { transition } from '../library/anime'
import { $dom } from '../library/dom'

export function algoliaSearch (pjax) {
  if (CONFIG.search === null) { return }

  if (!siteSearch) {
    setSiteSearch(BODY.createChild('div', {
      id: 'search',
      innerHTML: '<div class="inner"><div class="header"><span class="icon"><i class="ic i-search"></i></span><div class="search-input-container"></div><span class="close-btn"><i class="ic i-times-circle"></i></span></div><div class="results"><div class="inner"><div id="search-stats"></div><div id="search-hits"></div><div id="search-pagination"></div></div></div></div>'
    }))
  }

  const search = instantsearch({
    indexName: CONFIG.search.indexName,
    searchClient: algoliasearch(CONFIG.search.appID, CONFIG.search.apiKey),
    searchFunction (helper) {
      const searchInput = <HTMLInputElement><unknown>$dom('.search-input')
      if (searchInput.value) {
        helper.search()
      }
    }
  })

  search.on('render', () => {
    pjax.refresh($dom('#search-hits'))
  })

  // Registering Widgets
  search.addWidgets([
    instantsearch.widgets.configure({
      hitsPerPage: CONFIG.search.hits.per_page || 10
    }),

    instantsearch.widgets.searchBox({
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

    instantsearch.widgets.stats({
      container: '#search-stats',
      templates: {
        text (data) {
          const stats = LOCAL.search.stats
            .replace(/\$\{hits}/, data.nbHits)
            .replace(/\$\{time}/, data.processingTimeMS)
          return stats + '<span class="algolia-powered"></span><hr>'
        }
      }
    }),

    instantsearch.widgets.hits({
      container: '#search-hits',
      templates: {
        item (data) {
          const cats = data.categories ? '<span>' + data.categories.join('<i class="ic i-angle-right"></i>') + '</span>' : ''
          return '<a href="' + CONFIG.root + data.path + '">' + cats + data._highlightResult.title.value + '</a>'
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

    instantsearch.widgets.pagination({
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

  // Handle and trigger popup window
  $dom.each('.search', (element) => {
    element.addEventListener('click', () => {
      document.body.style.overflow = 'hidden'
      transition(siteSearch, 'shrinkIn', () => {
        $dom('.search-input').focus()
      }) // transition.shrinkIn
    })
  })

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
  $dom('.close-btn').addEventListener('click', onPopupClose)
  window.addEventListener('pjax:success', onPopupClose)
  window.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
      onPopupClose()
    }
  })
}
