/**
 * Author : FitGrace【fitingrace@gmail.com 】
 * Link   : http://www.fitgrace.com/
 * Since  : 2018-03-08
 *
 * Description【作用描述】
 *    获取古诗文网诗文列表
 *
 * Requires【依赖模块】
 * Param【 参数】
 * Example【 示例】
 * Return【 返回值】
 *
 * [+] Data by author
 *     添加描述
 * [*] Data by author
 *     修改描述
 * [!] Data by author
 *     删除描述
 *
 */

const cheerio = require('cheerio')
import urlArr from './depot/gushiwen_org_shiwen_url'
import { getSplinter, saveSplinter } from './utils/index'


// 判断是否还有下一页
const hasNext = (len, infoEl) => {
  const $ = cheerio.load(infoEl)
  const isNext = $('.pages').find('a').length

  if (isNext > 0) {
    len++
    getInfo(len)
  } else {
    console.log('抓取完成，没有下一项了！')

    const fileName = './src/depot/gushiwen_org_shiwen_url.js'
    const fileInfo = `
      const urlArr = ${JSON.stringify(urlArr)}
      export default urlArr
    `
    saveSplinter(fileName, fileInfo)
  }
}


// 解析抓取到的页面信息
const analyze = (infoEl) => {
  const $ = cheerio.load(infoEl)
  const sons = $('.sons')

  sons.each((i, elem) => {
    const curUrl = $(elem).find('.cont').find('p').eq(0).find('a').attr('href')
    const curEra = $(elem).find('.cont').find('.source').find('a').eq(0).text()
    const curTitle = $(elem).find('.cont').find('p').eq(0).find('a').text()
    const curAuthor = $(elem).find('.cont').find('.source').find('a').eq(1).text()

    urlArr[curUrl] = `${curEra}_${curAuthor}_${curTitle}`
  })
}


// 开始列表信息抓取
const getInfo = (pageNum) => {
  let len = pageNum
  let initUrl = `http://www.gushiwen.org/shiwen/default_0A0A${len}.aspx`
  console.log('get page info', initUrl)

  const arr = Object.keys(urlArr)
  if (arr.includes(initUrl)) {
    console.log(`${curUrl} 已经存在，无需再次抓取！！！`)
  } else {
    getSplinter(initUrl, function(resData) {
      const $ = cheerio.load(resData)
      const infoEl = $('.main3 .left')

      analyze(infoEl.html())
      hasNext(len, infoEl.html())
    })
  }
}

getInfo(1)
