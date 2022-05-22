const ora = require('ora')
const fs = require('fs')
const download = require('download-git-repo')
const { red, green } = require('kolorist')
const { outputCommand } = require('./cliCommand')
const { exitFn } = require('./utils')

// 下载远程模版工程
async function downloadRepositoryTemplate(result) {
  const { type, projectName } = result
  const spinner = ora('创建项目中，请等待...')
  try {
    spinner.start()
    await cloneProject(type, projectName)
    const fileName = `${projectName}/package.json`
    if (fs.existsSync(fileName)) {
      const content = fs.readFileSync(fileName).toString()
      let contenJson = JSON.parse(content)
      contenJson.name = projectName
      fs.writeFileSync(fileName, JSON.stringify(contenJson, null, 2))
    }
    spinner.succeed()
    console.log(green('项目初始化完成，现在请执行'))
    outputCommand(projectName, type.type)
  } catch (error) {
    spinner.fail()
    exitFn('拉去项目失败、请稍后重试')
    console.log(red(error.message || error))
  }
}

// 通过 download-git-repo 进行 下载
function cloneProject(type, projectName) {
  return new Promise((resolve, reject) => {
    try {
      download(`direct:${type.url}`, projectName, { clone: true }, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = downloadRepositoryTemplate
