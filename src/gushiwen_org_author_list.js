/**
 * Author : FitGrace【fitingrace@gmail.com 】
 * Link   : http://www.fitgrace.com/
 * Since  : 2018-03-08
 *
 * Description【作用描述】
 *    获取古诗文网作者列表
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
import urlArr from './depot/gushiwen_org_author_list'
import { getSplinter, saveSplinter } from './utils/index'


// 判断是否还有下一页
const hasNext = (len, sonsLen) => {
  if (sonsLen > 5 || len === 1) {
    len++
    getInfo(len)
  } else {
    console.log('抓取完成，没有下一项了！')

    const fileName = './src/depot/gushiwen_org_author_list.js'
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
  const sons = $('.main3').find('.left').find('.sonspic')

  sons.each((i, elem) => {
    const curUrl = $(elem).find('.cont').find('a').eq(0).attr('href').replace('/', '').replace('.aspx', '')
    const curName = $(elem).find('.cont').find('a').eq(0).text()
    const curPhoto = $(elem).find('.divimg').find('img').attr('src')

    urlArr[curUrl] = {}
    urlArr[curUrl].name = curName
    urlArr[curUrl].photo = curPhoto
  })

  const nextLen = $('.main3').find('.left').find('.pages').find('a').length

  hasNext(len, nextLen)
}


// 开始列表信息抓取
const getInfo = (pageNum) => {
  let len = pageNum
  let initUrl = `http://so.gushiwen.org/authors/Default.aspx?p=${len}&c=`
  console.log('get page info', len, initUrl)

  getSplinter(initUrl, function(resData) {
    analyze(len, resData)
  })
}

getInfo(1)
