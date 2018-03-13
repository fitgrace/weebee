/**
 * Author : FitGrace【fitingrace@gmail.com 】
 * Link   : http://www.fitgrace.com/
 * Since  : 2018-03-10
 *
 * Description【作用描述】
 *    获取古诗文网诗作者篇详情
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
import detailArr from './depot/gushiwen_org_author_detail'
import { getSplinter, saveSplinter } from './utils/index'

let len = 0

// 解析抓取到的页面信息
const analyze = (curUrl, fileName, sum, infoData) => {
  const $ = cheerio.load(infoData)
  const infoEl = $('.main3 .left')
  $(infoEl).find('.adsbygoogle').parent().remove()

  const filePath = `depot/gushiwen_org_author/${fileName}.html`
  const fileInfo = $(infoEl).html()

  saveSplinter(filePath, fileInfo, () => {
    len++
    detailArr[fileName] = filePath

    console.log(len, sum)
    if (len === sum ) {
      const fileName = './src/depot/gushiwen_org_author_detail.js'
      const fileInfo = `
        const detailArr = ${JSON.stringify(detailArr)}
        export default detailArr
      `
      // 保存抓取完成的信息目录
      saveSplinter(fileName, fileInfo)
    }

  })
}


// 开始列表信息抓取
const getDetail = () => {
  const listArr = Object.keys(urlArr)
  const detArr = Object.keys(detailArr)
  console.log('要抓取的数据共计：', listArr.length)

  for (let curUrl of listArr) {
    const urlVal = `http://so.gushiwen.org/${curUrl}`
    console.log('curUrl：', urlVal)
    const fileName = curUrl.replace('.aspx', '')
    console.log('fileName：', fileName)

    if (detArr.includes(fileName)) {
      len++
      console.log(`${curUrl} 已经存在，无需再次抓取！！！`)
    } else {
      getSplinter(urlVal, function(resData) {
        analyze(curUrl, fileName, listArr.length, resData)
      })
    }
  }

}

getDetail()
