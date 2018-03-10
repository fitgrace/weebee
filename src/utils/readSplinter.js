/**
 * Author : FitGrace【fitingrace@gmail.com 】
 * Link   : http://www.fitgrace.com/
 * Since  : 2018-03-10
 *
 * Description【作用描述】
 *    用于异步读取文件
 *
 * Requires【依赖模块】
 * Param【 参数】
 * Example【 示例】
 * Return【 返回值】
 *
 */

const fs = require("fs")

const readSplinter = (filePath, callback) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) console.log(`读取文件${filePath}失败`, err)

    if (typeof callback === 'function') callback(data)
  })
}

export { readSplinter }
