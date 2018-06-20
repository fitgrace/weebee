/**
 * Author : FitGrace【fitingrace@gmail.com 】
 * Link   : http://www.fitgrace.com/
 * Since  : 2018-03-07
 *
 * Description【作用描述】
 *    根据URL 地址，获取页面信息
 *
 * Requires【依赖模块】
 *
 * Param【 参数】
 *  url : 获得碎片信息的url
 *  charset    : 要获取页面编码格式
 *
 * Example【 示例】
 * Return【 返回值】
 *
 */

import axios from 'axios'
const iconv = require('iconv-lite')

const fetchChunk = (url, charset) => {
  return new Promise((resolve, reject) => {
    axios.get(url, {responseType: 'arraybuffer'}).then(res => {
      const buf = res.data
      const chunk = iconv.decode(buf, charset)
      resolve(chunk)
    }).catch(err => reject(err))
  })
}

export { fetchChunk }
