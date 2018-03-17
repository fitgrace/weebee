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
import urlArr from './depot/gushiwen_org_shiwen_list_0'
import attrArr from './depot/gushiwen_org_shiwen_attr'
import detailArr from './depot/gushiwen_org_shiwen_detail'
import { getSplinter, saveSplinter } from './utils/index'

let len = 0

attrArr.fyi = []
attrArr.sxi = []

// 保存文件
const opSave = (sum, moreLen, moreSum, fileName, ele) => {
  console.log('moreLen：', moreLen, 'moreNum：', moreSum)

  const $ = cheerio.load(ele, {decodeEntities: false})

  // 删除 有用，没用
  // $('.sons').find('a[href*="javascript:ding"]').parent().remove()

  // 删除朗读的小喇叭
  // $('img[src="/img/speaker.png"]').parent().remove()


	const filePath = `depot/gushiwen_org_shiwen/${fileName}.html`
	const fileInfo = $.html()

  if (moreLen === moreSum) {
    saveSplinter(filePath, fileInfo, () => {
      len++
      detailArr[fileName] = filePath

      console.log(len, sum)

      // 保存抓取完成的信息目录
      if (len === sum ) {
        const fileName = './src/depot/gushiwen_org_shiwen_detail.js'
        const fileInfo = `const detailArr = ${JSON.stringify(detailArr)}
        export default detailArr`

        saveSplinter(fileName, fileInfo)
      }
    })
  }
}

// 解析抓取到的页面信息
const analyze = (fileName, sum, infoData) => {
  const $ = cheerio.load(infoData, {decodeEntities: false})
  const infoEl = $('.main3 .left')

  // 删除底部广告
  // $(infoEl).find('.adsbygoogle').parent().remove()

  // 删除顶部隐藏全文
  $(infoEl).find('textarea').eq(0).parent().remove()

  // 删除作者下面的所有项
  $(infoEl).find('.sonspic').nextAll().remove()

  // 删除作者项
  $(infoEl).find('.sonspic').remove()
  $(infoEl).find('textarea[id*="txtareAuthor"]').parent().remove()

  // 删队正文右上角译注赏
  $(infoEl).find('.sons').eq(0).find('.yizhu').remove()

  // 删队正文底部操作
  $(infoEl).find('.sons').eq(0).find('.tool').remove()
  $(infoEl).find('.sons').eq(0).find('.toolerweima').remove()
  $(infoEl).find('.sons').eq(0).find('div[id*="toolPlay"]').remove()

  // 删除隐藏元素
  $(infoEl).find('.sons[style="display:none;"]').remove()


  // 遍历所有要翻译的信息块
  $(infoEl).find('a[href*="javascript:fanyiShow"]').each((i, elem) => {
    const curEl = $(elem)
    const fyNum = $(elem).attr('href').replace('javascript:fanyiShow(','').replace(')', '')
    console.log('fan yi num：', fyNum)
  })


  // 遍历所有要获得更多赏析的信息块
  $(infoEl).find('a[href*="javascript:shangxiShow"]').each((i, elem) => {
    const curEl = $(elem)
    const sxNum = $(elem).attr('href').replace('javascript:shangxiShow(','').replace(')', '')
    console.log('shang xi num：', sxNum)
  })
  // opSave(sum, moreLen, moreNum, fileName, $(infoEl).html())


  const moreNum = $(infoEl).find('a[href*="javascript:fanyiShow"]').length + $(infoEl).find('a[href*="javascript:shangxiShow"]').length
  $(infoEl).find('.sons').each((i, elem) => {
    const curEl = $(elem)

    // 是否有更多翻译
    const fyLen = $(elem).find('a[href*="javascript:fanyiShow"]').length
    if (fyLen > 0) {
      const fyNum = $(elem).find('a[href*="javascript:fanyiShow"]').attr('href').replace('javascript:fanyiShow(','').replace(')', '')
      // console.log('fanyi：', fyNum)
      getSplinter(`http://so.gushiwen.org/shiwen2017/ajaxfanyi.aspx?id=${fyNum}`, function(resData) {
        // $(elem).html('')
        const resEl = cheerio.load(resData, {decodeEntities: false})
        $(elem).html('').append(resEl.html())

        moreLen++

        opSave(sum, moreLen, moreNum, fileName, $(infoEl).html())
      })
    }

    // 是否有更多赏析
    const sxLen = $(elem).find('a[href*="javascript:shangxiShow"]').length
    if (sxLen > 0) {
      const sxNum = $(elem).find('a[href*="javascript:shangxiShow"]').attr('href').replace('javascript:shangxiShow(','').replace(')', '')
      $(elem).html('')
      // console.log('shangxi：', sxNum)
      getSplinter(`http://so.gushiwen.org/shiwen2017/ajaxshangxi.aspx?id=${sxNum}`, function(resData) {
        // $(elem).html('')
        const resEl = cheerio.load(resData, {decodeEntities: false})
        $(elem).html('').append(resEl.html())

        moreLen++

        opSave(sum, moreLen, moreNum, fileName, $(infoEl).html())
      })
    }
  })

  // console.log(fileInfo)
}


// 开始列表信息抓取
const getDetail = () => {
  const listArr = Object.keys(urlArr)
  const detArr = Object.keys(detailArr)
  console.log('要抓取的数据共计：', listArr.length)

  for (let curUrl of listArr) {
    const urlVal = `http://so.gushiwen.org/${curUrl}.aspx`
    const fileName = curUrl

    if (detArr.includes(fileName)) {
      len++
      console.log(`${urlVal} 已经存在，无需再次抓取！！！`)
    } else {
      console.log('get page info', urlVal)

      getSplinter(urlVal, function(resData) {
        analyze(fileName, listArr.length, resData)
      })
    }
  }

}

getDetail()
