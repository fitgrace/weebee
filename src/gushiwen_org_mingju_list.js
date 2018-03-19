/**
 * Author : FitGrace【fitingrace@gmail.com 】
 * Link   : http://www.fitgrace.com/
 * Since  : 2018-03-08
 *
 * Description【作用描述】
 *    获取古诗文网名句列表
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
import urlArr from './depot/gushiwen_org_mingju_list'
import { getSplinter, saveSplinter } from './utils/index'


// 判断是否还有下一页
const hasNext = (len, sonsLen) => {
  if (sonsLen > 0) {
    len++
    getInfo(len)
  } else {
    console.log('抓取完成，没有下一项了！')

    const fileName = './src/depot/gushiwen_org_mingju_list.js'
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
  const sons = $('.main3').find('.left').find('.sons').find('.cont')
  const sonsLen = $('.main3').find('.left').find('.sons').find('.cont').length

  sons.each((i, elem) => {
    const curUrl = $(elem).find('a').eq(0).attr('href').replace('/mingju/', '').replace('.aspx', '')
    const curTitle = $(elem).find('a').eq(0).text()
    const authorSource = $(elem).find('a').eq(1).text().replace('》', '').split('《');

    urlArr[curUrl] = {}
    urlArr[curUrl].info = curTitle
    urlArr[curUrl].author = authorSource[0]
    urlArr[curUrl].source = authorSource[1]
  })

  hasNext(len, sonsLen)
}


// 开始列表信息抓取
const getInfo = (pageNum) => {
  let len = pageNum
  let initUrl = `http://so.gushiwen.org/mingju/Default.aspx?p=${len}&c=&t=`
  console.log('get page info', len, initUrl)

  getSplinter(initUrl, function(resData) {
    analyze(len, resData)
  })
}

getInfo(1)
