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
import gwListArr from './depot/gushiwen_org_guwen_list'
import { getSplinter, saveSplinter } from './utils/index'


// 判断是否还有下一页
const hasNext = (len, infoEl) => {
  const $ = cheerio.load(infoEl)
  const isNext = $('.sonspic').length

  if (isNext > 0) {
    len++
    getInfo(len)
  } else {
    console.log('抓取完成，没有下一项了！')

    const fileName = './src/depot/gushiwen_org_guwen_list.js'
    const fileInfo = `
      const gwListArr = ${JSON.stringify(gwListArr)}
      export default gwListArr
    `
    saveSplinter(fileName, fileInfo)
  }
}


// 解析抓取到的页面信息
const analyze = (infoEl) => {
  const $ = cheerio.load(infoEl)
  const sons = $('.sonspic')

  sons.each((i, elem) => {
    const urlVal = $(elem).find('p').eq(0).find('a').eq(0).attr('href').replace('/','')
    const curZZ = $(elem).find('p').eq(0).find('a').eq(0).text()

    gwListArr[urlVal] = curZZ
  })
}


// 开始列表信息抓取
const getInfo = (pageNum) => {
  let len = pageNum
  let initUrl = `http://so.gushiwen.org/guwen/Default.aspx?p=${len}`
  console.log('get mingju list：', initUrl)

  const arr = Object.keys(gwListArr)
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
