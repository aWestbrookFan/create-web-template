const prompts = require('prompts')
const Stream = require('stream')
const fs = require('fs')
const { typeList } = require('./typeList')
const { red } = require('kolorist')
const { exitFn } = require('./utils')
let types = typeList()

const promptFn = () => {
  return prompts(
    [
      {
        type: 'text',
        name: 'projectName',
        message: '项目名称:',
        initial: 'front-explore',
        validate: (dir) => isValidProjectName(dir),
        onState: (state) => {
          targetDir = state.value.trim() || 'front-explore'
        }
      },
      {
        type: 'select',
        name: 'type',
        message: '类型选择:',
        initial: 0,
        choices: types.map((val) => {
          return {
            title: val.name,
            value: val
          }
        })
      }
    ],
    {
      onCancel: () => {
        throw new Error(red('✖') + ' 操作取消')
      }
    }
  )
}

function isValidProjectName(projectName) {
  if (fs.existsSync(projectName)) {
    exitFn('已经退出、请重新创建')
    return '项目已经存在'
  }
  const regular =
    /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
      projectName
    )
  if (!regular) {
    exitFn('已经退出、请重新创建')
    return '请按规范输入项目名'
  }
  return true
}

module.exports.promptFn = promptFn
