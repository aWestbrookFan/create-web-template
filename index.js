#!/usr/bin/env node
const fs = require('fs')
const ora = require('ora')
const download = require('download-git-repo')
const { red, magenta, green } = require('kolorist')
const { promptFn } = require('./src/prompts')
const { outputCommand } = require('./src/cliCommand')
const { exitFn } = require('./src/utils')
async function init() {
  let result = {}
  try {
    result = await promptFn()
    downloadTemplate(result)
  } catch (cancelled) {
    console.log(magenta(cancelled.message))
    return
  }
}

// 下载模版工程
async function downloadTemplate(result) {
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
// clone工程
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

init().catch((e) => {
  exitFn('创建失败、已经退出、请重新创建')
  console.error(e)
})
