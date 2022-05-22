#!/usr/bin/env node
const { magenta } = require('kolorist')
const { promptFn } = require('./src/prompts')
const { exitFn } = require('./src/utils')
const downloadRepositoryTemplate = require('./src/download')

// 启动程序
async function bootstrap() {
  let result = {}
  try {
    result = await promptFn()
    downloadRepositoryTemplate(result)
  } catch (cancelled) {
    console.log(magenta(cancelled.message))
    return
  }
}

bootstrap().catch((e) => {
  exitFn('创建失败、已经退出、请重新创建')
  console.error(e)
})
