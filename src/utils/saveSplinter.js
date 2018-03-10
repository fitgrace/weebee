/**
 * Author : FitGrace【fitingrace@gmail.com 】
 * Link   : http://www.fitgrace.com/
 * Since  : 2018-03-07
 *
 * Description【作用描述】
 *    用于异步写入文件
 *
 * Requires【依赖模块】
 * Param【 参数】
 * Example【 示例】
 * Return【 返回值】
 *
 */

const fs = require("fs")

const saveSplinter = (fileName, fileInfo, callback) => {
  fs.writeFile(fileName, fileInfo, 'utf8', (err) => {
    if (err) console.log(`保存文件${fileName}失败`, err)

    if (typeof callback === 'function') callback()

    console.log(`文件${fileName}保存成功！`)
  })
}

export { saveSplinter }
