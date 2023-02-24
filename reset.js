const fsExtra = require('fs-extra')
const fs = require('fs')
const path = require('path')
const Bagpipe = require('bagpipe')
const { bookPath } = require('./fetch-cli/config')
const { Sitdown } = require('sitdown')

const timeBooks = fsExtra.readdirSync(path.resolve(__dirname, './time'))
const bagpipe = new Bagpipe(10, {
  timeout: 1500
})

let sitdown = new Sitdown({
  keepFilter: ['style'],
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  hr: '---',
});

console.log(timeBooks)

timeBooks.forEach(dir => {
  checkBookDir(dir)
  bagpipe.push(scanDir, path.join(__dirname, 'time', dir), dir)
})

function checkBookDir(title) {
  if (fsExtra.pathExistsSync(path.join(bookPath, title))) {
    return true
  }

  fs.mkdirSync(path.join(bookPath, title))
}

function scanDir(dirPath, bookTitle) {
  const files = fsExtra.readdirSync(dirPath)
  files.forEach(item => {
    const ext = path.extname(item)
    if (ext.indexOf('html') > -1) {
      bagpipe.push(parseHtmlToMarkdown, path.join(dirPath, item), bookTitle)
    }
    if (ext.indexOf('mp3') > -1) {
      fsExtra.copyFileSync(path.join(dirPath, item), path.join(bookPath, bookTitle, item))
    }
  })
}

function parseHtmlToMarkdown(filePath, bookTitle) {
  const title = path.basename(filePath)
  console.log(title)
  const content = fsExtra.readFileSync(filePath)
  const markdownRaw = sitdown.HTMLToMD(content.toString())

  fsExtra.writeFileSync(path.join(bookPath, bookTitle, title + '.md'), `
---
title: ${bookTitle}
---

${markdownRaw}
    `)
}