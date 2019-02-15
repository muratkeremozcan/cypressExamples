// @ts-check
const fs = require('fs')
const path = require('path')
const ora = require('ora')
const Promise = require('bluebird')
const repoRoot = path.join(__dirname, '..', '..')

const findRecord = title => {
  const dbFilename = path.join(repoRoot, 'data.json')
  const contents = JSON.parse(fs.readFileSync(dbFilename, 'utf8'))
  const todos = contents.todos
  return todos.find(record => record.title === title)
}

const hasRecordAsync = (title, ms) => {
  const delay = 50
  return new Promise((resolve, reject) => {
    if (ms < 0) {
      return reject(new Error(`Could not find record with title "${title}"`))
    }
    const found = findRecord(title)
    if (found) {
      return resolve(true)
    }
    setTimeout(() => {
      hasRecordAsync(title, ms - delay).then(resolve, reject)
    }, 50)
  })
}

module.exports = (on, config) => {
  // "cy.task" can be used from specs to "jump" into Node environment
  // and doing anything you might want. For example, checking "data.json" file!
  on('task', {
    hasSavedRecord (title, ms = 3000) {
      const spinner = ora(
        `looking for title "${title}" in the database`
      ).start()
      return hasRecordAsync(title, ms)
        .tap(() => {
          spinner.succeed(`found "${title}" in the database`)
        })
        .tapCatch(err => {
          spinner.fail(err.message)
        })
    }
  })
}
