const fs = require('fs')
const findMarkdown = require('./findMarkdown')
const rootDir = './post'
const excludeFiles = ['./post/README.md']

findMarkdown(rootDir, writeComponents)

function writeComponents(dir) {
  if (excludeFiles.indexOf(dir) !== -1) {
    fs.appendFile(dir, `\n \n <comment/> \n `, (err) => {
      if (err) throw err
      console.log(`add components to ${dir}`)
    })
  }
}