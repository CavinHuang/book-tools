const { httpRequest2, sleep } = require('./request')
const path = require('path')
const fs = require('fs')
const fsExtra = require('fs-extra')
const { Sitdown } = require('sitdown')
const { applyJuejinRule } = require('@sitdown/juejin')
const Bagpipe = require('bagpipe')
const { headers, bookPath } = require('./config')
const { fetchSectionContent } = require('./book-content')

const bagpipe = new Bagpipe(10, {
  timeout: 6000
})

async function getBookInfo(bookId, aid = '2608', uuid='6901189438177723912') {
  await sleep(2)
  const bookInfoRes = await httpRequest2(`https://api.juejin.cn/booklet_api/v1/booklet/get?aid=${aid}&uuid=${uuid}`, {
    booklet_id: bookId
  }, 'POST', headers)

  const bookInfo = (() => {
    try {
      return JSON.parse(bookInfoRes)
    } catch(e) {
      return null
    }
  })()

  if (bookInfo && bookInfo.err_no === 0) {
    const book = bookInfo.data
    const {title, summary} = book.booklet.base_info
    const introduction = book.introduction.content
    const sections = book.sections

    const sectionMd = sections.map((item) => {
      bagpipe.push(fetchSectionContent, item.section_id, title, aid, uuid)
      const itemTitle = item.title
                                  .replace(/\|/g, '')
                                  .replace(/\//g, ' or ')
                                  .replace(/[：:]/g, '-')
                                  .replace(/\\/g, '')
                                  .replace(/\//g, '')
                                  .replace(/\*/g, '')
                                  .replace(/\?/g, '')
                                  .replace(/\</g, '')
                                  .replace(/\>/g, '')
                                  .replace(/(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g, '')
      return `<li><a href='./${itemTitle}.md'>${item.title}</a></li>`
    }).join('\r\n')

    let sitdown = new Sitdown({
      keepFilter: ['style'],
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
      hr: '---',
    });
    sitdown.use(applyJuejinRule);
    checkBookDir(title)
    fsExtra.writeFileSync(path.join(bookPath, title, 'booInfo.json'), JSON.stringify(bookInfo, null, 2))
    fsExtra.writeFileSync(path.join(bookPath, title, 'index.md'), `
---
title: ${title}
---

## 简介
${summary}

## 说明
${sitdown.HTMLToMD(introduction)}

## 章节
${sitdown.HTMLToMD(sectionMd)}

    `)
  }
}

function checkBookDir(title) {
  if (fsExtra.pathExistsSync(path.join(bookPath, title))) {
    return true
  }

  fs.mkdirSync(path.join(bookPath, title))
}


module.exports = {
  getBookInfo
}