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
import urlArr from './depot/gushiwen_org_guwen_list'
import gwDirArr from './depot/gushiwen_org_guwen_dir'
import { getSplinter, saveSplinter } from './utils/index'

let len = 0

// 解析抓取到的页面信息
const analyze = (curUrl, fileName, sum, infoEl) => {
  const $ = cheerio.load(infoEl)
  const sons = $('.main3').find('.left')
  const sonspic = sons.find('.sonspic')
  const urlVal = curUrl

  gwDirArr[urlVal] = {}
  gwDirArr[urlVal].name = sons.find('.sonspic').find('h1').find('span').eq(0).text()
  gwDirArr[urlVal].summary = sons.find('.sonspic').find('p').eq(0).text()

  const bookcont = sons.find('.sons').find('.bookcont')
  bookcont.each((i, elem) => {
    const chapter = $(elem).find('.bookMl').text() || 'noChapter'
    gwDirArr[urlVal][chapter] = {}

    $(elem).find('span').each((i, el) => {
      const partUrl = $(el).find('a').attr('href')
      const partTxt = $(el).find('a').text()
      gwDirArr[urlVal][chapter][partUrl] = partTxt
    })
  })

  len++
  console.log(len, sum)

  if (len === sum ) {
    const fileName = './src/depot/gushiwen_org_guwen_dir.js'
    const fileInfo = `
      const gwDirArr = ${JSON.stringify(gwDirArr)}
      export default gwDirArr
    `
    // 保存抓取完成的信息目录
    saveSplinter(fileName, fileInfo)
  }
}


// 开始某一古文目录信息抓取
const getDir = () => {
  const listArr = Object.keys(urlArr)
  const dirArr = Object.keys(gwDirArr)
  console.log('要抓取的数据共计：', listArr.length)

  for (let curUrl of listArr) {
    const urlVal = `http://so.gushiwen.org/${curUrl}`
    console.log('curUrl：', urlVal)
    const fileName = curUrl.replace('.aspx', '')
    console.log('fileName：', fileName)

    if (dirArr.includes(fileName)) {
      len++
      console.log(`${curUrl} 已经存在，无需再次抓取！！！`)
    } else {
      getSplinter(urlVal, function(resData) {
        analyze(curUrl, fileName, listArr.length, resData)
      })
    }
  }

}

getDir()
