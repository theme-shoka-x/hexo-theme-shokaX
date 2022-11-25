'use strict'

const cheerio = require('cheerio')
const moment = require('moment')

hexo.extend.filter.register('after_render:html', function (locals) {
  const $ = cheerio.load(locals)
  const calendar = $('#posts-calendar')
  const post = $('#posts-chart')
  const tag = $('#tags-chart')
  const category = $('#categories-chart')
  let htmlEncode = false

  if (calendar.length > 0 || post.length > 0 || tag.length > 0 || category.length > 0) {
    if (calendar.length > 0 && $('#postsCalendar').length === 0) {
      if (calendar.attr('data-encode') === 'true') htmlEncode = true
      calendar.after(postsCalendar())
    }
    if (post.length > 0 && $('#postsChart').length === 0) {
      if (post.attr('data-encode') === 'true') htmlEncode = true
      post.after(postsChart())
    }
    if (tag.length > 0 && $('#tagsChart').length === 0) {
      if (tag.attr('data-encode') === 'true') htmlEncode = true
      tag.after(tagsChart(tag.attr('data-length')))
    }
    if (category.length > 0 && $('#categoriesChart').length === 0) {
      if (category.attr('data-encode') === 'true') htmlEncode = true
      category.after(categoriesChart())
    }

    if (htmlEncode) {
      return $.root().html().replace(/&amp;#/g, '&#')
    } else {
      return $.root().html()
    }
  } else {
    return locals
  }
}, 15)

function postsCalendar () {
  // calculate range.
  const start_date = moment().subtract(1, 'years')
  const end_date = moment()
  const rangeArr = '["' + start_date.format('YYYY-MM-DD') + '", "' + end_date.format('YYYY-MM-DD') + '"]'

  // post and count map.
  const dateMap = new Map()
  hexo.locals.get('posts').forEach(function (post) {
    const date = post.date.format('YYYY-MM-DD')
    const count = dateMap.get(date)
    dateMap.set(date, count == null || false ? 1 : count + 1)
  })

  // loop the data for the current year, generating the number of post per day
  let i = 0
  let datePosts = '['
  const day_time = 3600 * 24 * 1000
  for (let time = start_date; time <= end_date; time += day_time) {
    const date = moment(time).format('YYYY-MM-DD')
    datePosts = (i === 0 ? datePosts + '["' : datePosts + ', ["') + date + '", ' +
            (dateMap.has(date) ? dateMap.get(date) : 0) + ']'
    i++
  }
  datePosts += ']'

  return `
  <script id="postsCalendar">
    var color = document.documentElement.getAttribute('data-theme') === null ? '#000' : '#fff'
    var postsCalendar = echarts.init(document.getElementById('posts-calendar'), 'light');
    var postsCalendarOption = {
      textStyle: {
        color: color
      },
      title: {
          top: 0,
          text: '文章发布日历',
          left: 'center',
          textStyle: {
              color: color
          }
      },
      tooltip: {
          formatter: function (obj) {
              var value = obj.value;
              return '<div style="font-size: 14px;">' + value[0] + '：' + value[1] + '</div>';
          }
      },
      visualMap: {
          show: true,
          showLabel: true,
          categories: [0, 1, 2, 3, 4],
          calculable: true,
          textStyle:{
            color: color
          },
          inRange: {
              symbol: 'rect',
              color: ['#d7dbe2', '#fc9bd9', '#f838b2', '#c4067e', '#540336']
          },
          itemWidth: 12,
          itemHeight: 12,
          orient: 'horizontal',
          left: 'center',
          bottom: 80
      },
      calendar: {
          left: 'center',
          range: ${rangeArr},
          cellSize: [13, 13],
          splitLine: {
              show: true
          },
          itemStyle: {
              color: '#111',
              borderColor: '#fff',
              borderWidth: 2
          },
          yearLabel: {
              show: false,
              color: color
          },
          monthLabel: {
              nameMap: 'cn',
              fontSize: 11,
              color: color
          },
          dayLabel: {
              formatter: '{start}  1st',
              nameMap: 'cn',
              fontSize: 11,
              color: color
          }
      },
      series: [{
          type: 'heatmap',
          coordinateSystem: 'calendar',
          calendarIndex: 0,
          data: ${datePosts}
      }]
    };
    postsCalendar.setOption(postsCalendarOption);
    window.addEventListener("resize", () => {
      postsCalendar.resize();
    });
    </script>`
}

function postsChart () {
  const startDate = moment('2022-01') // 开始统计的时间
  const endDate = moment()

  const monthMap = new Map()
  const dayTime = 3600 * 24 * 1000
  for (let time = startDate; time <= endDate; time += dayTime) {
    const month = moment(time).format('YYYY-MM')
    if (!monthMap.has(month)) {
      monthMap.set(month, 0)
    }
  }
  hexo.locals.get('posts').forEach(function (post) {
    const month = post.date.format('YYYY-MM')
    if (monthMap.has(month)) {
      monthMap.set(month, monthMap.get(month) + 1)
    }
  })
  const monthArr = JSON.stringify([...monthMap.keys()])
  const monthValueArr = JSON.stringify([...monthMap.values()])

  return `
  <script id="postsChart">
    var color = document.documentElement.getAttribute('data-theme') === null ? '#000' : '#fff'
    var postsChart = echarts.init(document.getElementById('posts-chart'), 'light');
    var postsOption = {
      textStyle: {
        color: color
      },
      title: {
        text: '文章发布统计图',
        x: 'center',
        textStyle: {
          color: color
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        name: '日期',
        type: 'category',
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: color
          }
        },
        data: ${monthArr}
      },
      yAxis: {
        name: '文章篇数',
        type: 'value',
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: color
          }
        }
      },
      series: [{
        name: '文章篇数',
        type: 'line',
        smooth: true,
        lineStyle: {
            width: 0
        },
        showSymbol: false,
        itemStyle: {
          opacity: 1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(128, 255, 165)'
          },
          {
            offset: 1,
            color: 'rgba(1, 191, 236)'
          }])
        },
        areaStyle: {
          opacity: 1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(128, 255, 165)'
          }, {
            offset: 1,
            color: 'rgba(1, 191, 236)'
          }])
        },
        data: ${monthValueArr},
        markLine: {
          data: [{
            name: '平均值',
            type: 'average'
          }]
        }
      }]
    };
    postsChart.setOption(postsOption);
    window.addEventListener("resize", () => {
      postsChart.resize();
    });
    </script>`
}

function tagsChart (len) {
  const tagArr = []
  // eslint-disable-next-line array-callback-return
  hexo.locals.get('tags').map(tag => {
    tagArr.push({ name: tag.name, value: tag.length })
  })
  tagArr.sort((a, b) => {
    return b.value - a.value
  })

  const dataLength = Math.min(tagArr.length, len) || tagArr.length
  const tagNameArr = []
  const tagCountArr = []
  for (let i = 0; i < dataLength; i++) {
    tagNameArr.push(tagArr[i].name)
    tagCountArr.push(tagArr[i].value)
  }
  const tagNameArrJson = JSON.stringify(tagNameArr)
  const tagCountArrJson = JSON.stringify(tagCountArr)

  return `
  <script id="tagsChart">
    var color = document.documentElement.getAttribute('data-theme') === null ? '#000' : '#fff'
    var tagsChart = echarts.init(document.getElementById('tags-chart'), 'light');
    var tagsOption = {
      textStyle: {
        color: color
      },
      title: {
        text: 'Top ${dataLength} 标签统计图',
        x: 'center',
        textStyle: {
          color: color
        }
      },
      tooltip: {},
      xAxis: {
        name: '标签',
        type: 'category',
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: color
          }
        },
        data: ${tagNameArrJson}
      },
      yAxis: {
        name: '文章篇数',
        type: 'value',
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: color
          }
        }
      },
      series: [{
        name: '文章篇数',
        type: 'bar',
        data: ${tagCountArrJson},
        itemStyle: {
          opacity: 1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(128, 255, 165)'
          },
          {
            offset: 1,
            color: 'rgba(1, 191, 236)'
          }])
        },
        emphasis: {
          itemStyle: {
            opacity: 1,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(128, 255, 195)'
            },
            {
              offset: 1,
              color: 'rgba(1, 211, 255)'
            }])
          }
        },
        markLine: {
          data: [{
            name: '平均值',
            type: 'average'
          }]
        }
      }]
    };
    tagsChart.setOption(tagsOption);
    window.addEventListener("resize", () => {
      tagsChart.resize();
    });
    </script>`
}

function categoriesChart () {
  const categoryArr = []
  // eslint-disable-next-line array-callback-return
  hexo.locals.get('categories').map(category => {
    categoryArr.push({ name: category.name, value: category.length })
  })
  categoryArr.sort((a, b) => {
    return b.value - a.value
  })
  const categoryArrJson = JSON.stringify(categoryArr)

  return `
  <script id="categoriesChart">
    var color = document.documentElement.getAttribute('data-theme') === null ? '#000' : '#fff'
    var categoriesChart = echarts.init(document.getElementById('categories-chart'), 'light');
    var categoriesOption = {
      textStyle: {
        color: color
      },
      title: {
        text: '文章分类统计图',
        x: 'center',
        textStyle: {
          color: color
        }
      },
      legend: {
        top: 'bottom',
        textStyle: {
          color: color
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      series: [{
        name: '文章篇数',
        type: 'pie',
        radius: [30, 80],
        center: ['50%', '50%'],
        roseType: 'area',
        label: {
          formatter: "{b} : {c} ({d}%)"
        },
        data: ${categoryArrJson},
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(255, 255, 255, 0.5)'
          }
        }
      }]
    };
    categoriesChart.setOption(categoriesOption);
    window.addEventListener("resize", () => {
      categoriesChart.resize();
    });
    </script>`
}
