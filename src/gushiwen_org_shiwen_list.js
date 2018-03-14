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
import urlArr from './depot/gushiwen_org_shiwen_list'
import { getSplinter, saveSplinter } from './utils/index'


// 判断是否还有下一页
const hasNext = (len, sonsLen) => {
  if (sonsLen > 0) {
    len++
    getInfo(len)
  } else {
    console.log('抓取完成，没有下一项了！')

    const fileName = './src/depot/gushiwen_org_shiwen_list.js'
    const fileInfo = `
      const urlArr = ${JSON.stringify(urlArr)}
      export default urlArr
    `
    saveSplinter(fileName, fileInfo)
  }
}


// 解析抓取到的页面信息
const analyze = (len, infoEl) => {
  const $ = cheerio.load(infoEl)
  const sons = $('.main3').find('.left').find('.sons')
  const sonsLen = $('.main3').find('.left').find('.sons').length

  sons.each((i, elem) => {
    const curUrl = $(elem).find('.cont').find('p').eq(0).find('a').attr('href').replace('http://so.gushiwen.org/', '').replace('.aspx', '')
    const curEra = $(elem).find('.cont').find('.source').find('a').eq(0).text()
    const curAuthor = $(elem).find('.cont').find('.source').find('a').eq(1).text()
    const curTitle = $(elem).find('.cont').find('p').eq(0).find('a').text()

    urlArr[curUrl] = {}
    urlArr[curUrl].era = curEra
    urlArr[curUrl].author = curAuthor
    urlArr[curUrl].title = curTitle
  })

  hasNext(len, sonsLen)
}


// 开始列表信息抓取
const getInfo = (pageNum) => {
  let len = pageNum
  let initUrl = `http://www.gushiwen.org/shiwen/default_0A0A${len}.aspx`
  console.log('get page info', initUrl)

  getSplinter(initUrl, function(resData) {
    analyze(len, resData)
  })
}

getInfo(1)
