/**
 * Author : FitGrace【fitingrace@gmail.com 】
 * Link   : http://www.fitgrace.com/
 * Since  : 2018-03-10
 *
 * Description【作用描述】
 *    获取古诗文网名句单篇详情
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
import urlArr from './depot/gushiwen_org_mingju_list_3'
import detailArr from './depot/gushiwen_org_mingju_detail'
import { getSplinter, saveSplinter } from './utils/index'

let len = 0

// 保存文件
const opSave = (sum, fileName, ele) => {
  const $ = cheerio.load(ele, {decodeEntities: false})

	const filePath = `depot/gushiwen_org_mingju/${fileName}.html`
	const fileInfo = $.html()

  saveSplinter(filePath, fileInfo, () => {
    len++
    detailArr.push(fileName)

    console.log(`共计${sum}当前完成${len}：${filePath}`)

    // 保存抓取完成的信息目录
    if (len === sum ) {
      const paramName = './src/depot/gushiwen_org_mingju_detail.js'
      const paramInfo = `const detailArr = ${JSON.stringify(detailArr)}
      export default detailArr`
      saveSplinter(paramName, paramInfo)
    }

  })
}

// 解析抓取到的页面信息
const analyze = (fileName, sum, infoData) => {
  const $ = cheerio.load(infoData, {decodeEntities: false})
  const infoEl = $('.main3 .left')

  if (infoEl.html() == null) {
    len++
  } else {
    opSave(sum, fileName, $(infoEl).html())
  }

}


// 开始列表信息抓取
const getDetail = () => {
  const listArr = Object.keys(urlArr)
  console.log('要抓取的数据共计：', listArr.length)

  for (let i = 0; i < listArr.length; i++) {
    const curUrl = listArr[i]
    const urlVal = `http://so.gushiwen.org/mingju/${curUrl}.aspx`
    const fileName = curUrl

    if (detailArr.includes(curUrl)) {
      len++
      console.log(`${urlVal} 已经存在，无需再次抓取！！！`)
    } else {
      (function(urlVal) {
        setTimeout(function() {

          console.log('get page info：', urlVal)

          getSplinter(urlVal, function(resData) {
            analyze(fileName, listArr.length, resData)
          })

        }, i * 500)
      })(urlVal)

    }
  }

}

getDetail()
