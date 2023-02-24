const { httpRequest2, sleep } = require('./request')
const path = require('path')
const fsExtra = require('fs-extra')
const { headers, bookPath } = require('./config')
const Bagpipe = require('bagpipe')
const { getBookInfo } = require('./book-info')

const bagpipe = new Bagpipe(10, {
  timeout: 6000
})

async function fetchBookList(aid='2608', uuid='6901189438177723912') {
  const sectionRes = await httpRequest2(`https://api.juejin.cn/booklet_api/v1/booklet/bookletshelflist?aid=${aid}&uuid=${uuid}`, {}, 'POST', headers)

  const sectionInfo = (() => {
    try {
      return JSON.parse(sectionRes)
    } catch (e) {
      return null
    }
  })()

  if (sectionInfo && sectionInfo.err_no === 0) {
    const myBookList = sectionInfo.data.filter(item => item.is_buy)
    myBookList.forEach(async (item) => {
      await sleep(2)
      bagpipe.push(getBookInfo, item.booklet_id, aid, uuid)
    })
    fsExtra.writeFileSync(path.join(bookPath, uuid +'_book_list.json'), JSON.stringify(myBookList, null, 2))
  }
}

module.exports = {
  fetchBookList
}