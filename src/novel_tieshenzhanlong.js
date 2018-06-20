/**
 * Author : FitGrace【fitingrace@gmail.com 】
 * Link   : http://www.fitgrace.com/
 * Since  : 2018-03-08
 *
 * Description【作用描述】
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

const iconv = require('iconv-lite')
const cheerio = require('cheerio')
import { dirArr } from './novelDir/tieshenzhanlong'
import { fetchChunk, saveSplinter } from './utils/index'

let len = 0
const novelName = '贴身战龙'
const novePath = '/data/wwwroot/novel/tieshenzhanlong/'
const endHtml = `</body></html>`
const headHtml = `<!DOCTYPE html><html lang="zh-cmn-Hans"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1"><meta name="renderer" content="webkit"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${novelName}</title><link rel="stylesheet" href="../style.css" /></head><body>`

// 保存目录
const saveCatalog = () => {
  const listArr = Object.keys(dirArr)
  let listEl = ''
  for (let i = 0; i < listArr.length; i++) {
    const curUrl = listArr[i]
    const curTxt = dirArr[curUrl]
    console.log('生成目录：', curTxt, curUrl)
    listEl += `<li><a href="${curUrl}.html">${curTxt}</a></li>`
  }
  const catalogEl = `<div class="book"><h1 class="book-title">${novelName}</h1><ul class="catalog">${listEl}</ul></div><div class="tool-bar"><a class="novel-list" href="../index.html">书架</a></div>`
  saveSplinter(`${novePath}index.html`, `${headHtml}${catalogEl}${endHtml}`, () => {
    const dirInfo = `export const dirArr = ${JSON.stringify(dirArr)}`
    saveSplinter('./src/novelDir/tieshenzhanlong.js', dirInfo)
  })
}

// 保存章节
const opSave = (saveInfo, pageEl, listSum, chapterTitle, fileName) => {
  const contentHtml = `<div class="chapter"><h1 class="chapter-title">${chapterTitle}</h1><div class="chapter-info">${saveInfo}</div></div><div class="tool-bar"><a class="novel-list" href="../index.html">书架</a><a class="catalog" href="./index.html">目录</a>${pageEl}</div>`

  saveSplinter(`${novePath}${fileName}.html`, `${headHtml}${contentHtml}${endHtml}`, () => {
    dirArr[fileName] = chapterTitle
    len++
    if (len === listSum) {
      saveCatalog(pageEl)
    }
  })
}

// 解析抓取到的章节
const analyzeChapter = (infoEl, listSum, chapterTitle, fileName) => {
  const $ = cheerio.load(infoEl, {decodeEntities: false})
  const chapter = $('.box_con').find('#content')

  if (chapter.html() == null) {
    len++
  } else {
    // const chapterInfo = $(chapter).html().replace(/\ +/g, '').replace(/<br>\n<br>/g, '</p>').replace(/\s\s\s\s/g, '<p>')
    const chapterInfo = $(chapter).html().replace(/<br>\n<br>/g, '</p>').replace(/\s\s\s\s\s/g, '<p>').replace(/\s\s\s\s/g, '')
    const perevNext = $('.novel').find('.pereview')
    $(perevNext).find('a').removeAttr('target')
    $(perevNext).find('a').eq(0).addClass('page-prev').text('上一章')
    $(perevNext).find('a').eq(2).addClass('page-next').text('下一章')
    $(perevNext).find('.back').remove()
    console.log(chapterInfo)

    // 页码
    const pageEl = $(perevNext).html()

    // opSave(chapterInfo, pageEl, listSum, chapterTitle, fileName)
  }
}


// 解析抓取到的目录
const analyzeList = (listEl) => {
  const $ = cheerio.load(listEl, {decodeEntities: false})
  const muluList = $('#list').find('a')
  const listSum = muluList.length
  const listArr = Object.keys(dirArr)

  muluList.each((i, elem) => {

    (function(el) {
      setTimeout(async () => {

        const curTitle = $(elem).text()
        const curUrl = $(elem).attr('href').replace('.html', '').replace('/1_1456/', '')
        // const urlVal = `https://www.88dus.com/xiaoshuo/98/98895/${curUrl}.html`
        const urlVal = `http://www.booktxt.com/1_1456/${curUrl}.html`

        if (listArr.includes(curUrl)) {
          len++
          console.log(listSum, i, `-- ${urlVal} 已经存在，无需再次抓取！！！`)
        } else {
          console.log('get Chapter', listSum, i, urlVal)
          const chapterEl = await fetchChunk(urlVal, 'GBK')
          analyzeChapter(chapterEl, listSum, curTitle, curUrl)
        }

      }, i * 550)
    })(elem)

  })

  // opSave(muluEle, 'catalog', 'list')
}


(async () => {
  // 目录url
  // let initUrl = `https://www.88dus.com/xiaoshuo/98/98895/`
  let initUrl = `http://www.booktxt.com/1_1456/`
  console.log('获取小说目录：', initUrl)

  try {
    const list = await fetchChunk(initUrl, 'GBK')
    analyzeList(list)
  } catch (err) {
    console.log(err)
  }

})()
