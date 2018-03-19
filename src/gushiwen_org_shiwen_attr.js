/**
 * Author : FitGrace【fitingrace@gmail.com 】
 * Link   : http://www.fitgrace.com/
 * Since  : 2018-03-10
 *
 * Description【作用描述】
 *    获取古诗文网诗文单篇详情
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
import attrArr from './depot/gushiwen_org_shiwen_attr'
import { getSplinter, saveSplinter } from './utils/index'

let len = 0

// 解析抓取到的页面信息
const analyze = (fileName, infoData) => {
  const $ = cheerio.load(infoData, {decodeEntities: false})

  const filePath = `depot/gushiwen_org_shiwen_fyi/${fileName}.html`
  // const filePath = `depot/gushiwen_org_shiwen_sxi/${fileName}.html`
	const fileInfo = $.html()

  saveSplinter(filePath, fileInfo, () => {
    len++
  })
}


// 开始列表信息抓取
const getDetail = () => {
  const listArr = attrArr.fyi
  // const listArr = attrArr.sxi
  console.log('要抓取的数据共计：', listArr.length)

//for (let curUrl of listArr) {
//  const urlVal = `http://so.gushiwen.org/shiwen2017/ajaxfanyi.aspx?id=${curUrl}`
//  // const urlVal = `http://so.gushiwen.org/shiwen2017/ajaxshangxi.aspx?id=${curUrl}`
//  const fileName = curUrl

//  console.log('get page info', listArr.length, len, urlVal)

//  getSplinter(urlVal, function(resData) {
//    analyze(fileName, resData)
//  })
//}

}

getDetail()
