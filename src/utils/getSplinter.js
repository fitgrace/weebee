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
 *  splinterURL : 获得碎片信息的url
 *  callback    : 获得信息后的回调
 *
 * Example【 示例】
 * Return【 返回值】
 *
 */

const http = require('http')

const getSplinter = (splinterURL, callback) => {
  http.get(splinterURL, (res) => {
    let size = 0
    let chunks = []

    res.on('data', (data) => {
      size += data.length
      chunks.push(data)
      // chunks += data
    })

    res.on('end', () => {
      let html = Buffer.concat(chunks, size)
      callback(html)
    })

  }).on('error', (err) => {
    console.log('获取信息错误！！！', err)
  })
}

export { getSplinter }
