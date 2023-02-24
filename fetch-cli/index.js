const book = require('./book-list')

book.fetchBookList().then(() => {
  console.log('开始')
})