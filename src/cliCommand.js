const { yellow } = require('kolorist')
module.exports.outputCommand = (name, type) => {
  if (type === 'jq') {
    console.log(yellow('请打开html文件夹对应的html文件进行查看'))
    return false
  }
  console.log(yellow(`cd ${name}\nnpm install\nnpm run serve `))
}
