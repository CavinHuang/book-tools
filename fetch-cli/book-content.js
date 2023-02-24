const { httpRequest2, sleep } = require('./request')
const path = require('path')
const fsExtra = require('fs-extra')
const { headers, bookPath } = require('./config')
const { Sitdown } = require('sitdown')
const { applyJuejinRule } = require('@sitdown/juejin')

let sitdown = new Sitdown({
  keepFilter: ['style'],
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  hr: '---',
});
sitdown.use(applyJuejinRule);

async function fetchSectionContent(sectionId, bookTitle, aid='2608', uuid='6901189438177723912') {
  await sleep(2)
  const sectionRes = await httpRequest2(`https://api.juejin.cn/booklet_api/v1/section/get?aid=${aid}&uuid=${uuid}`, {
    section_id: sectionId
  }, 'POST', headers, true)

  const sectionInfo = (() => {
    try {
      return JSON.parse(sectionRes)
    } catch (e) {
      return null
    }
  })()

  console.log(sectionInfo)
  if (sectionInfo && sectionInfo.err_no === 0) {
    let title = sectionInfo.data.section.title
    const markdown = sectionInfo.data.section.content

    title = title
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

    fsExtra.writeFileSync(path.join(bookPath, bookTitle, title + '.md'), `
# ${title}
---

${sitdown.HTMLToMD(markdown)}
    `)
  }
}

module.exports = {
  fetchSectionContent
}