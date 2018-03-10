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

const fs = require("fs")
const cheerio = require('cheerio')
import { readSplinter } from './utils/index'
import detailArr from './depot/gushiwen_org_shiwen_detail'

// 进程路径
const cwdPath = process.cwd()


// 解析文件信息
const analyze = (readData) => {
  const $ = cheerio.load(readData)
  const txtHd = $('.sons').eq(0).find('h1').text()

  console.log('文章标题：', txtHd)

//const curUrl = $(elem).find('.cont').find('p').eq(0).find('a').attr('href')
//const curEra = $(elem).find('.cont').find('.source').find('a').eq(0).text()
//const curTitle = $(elem).find('.cont').find('p').eq(0).find('a').text()
//const curAuthor = $(elem).find('.cont').find('.source').find('a').eq(1).text()
}

const arr = Object.keys(detailArr)
console.log(arr.length)

/*
for (let curUrl of arr) {
  const readPath = `${cwdPath}/${detailArr[curUrl]}`
  readSplinter(readPath, (resData) => {
    analyze(resData)
  })
}
*/
