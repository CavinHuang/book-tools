const request = require('request')
const util = require('util')
const Bagpipe = require('bagpipe')

const bagpipe = new Bagpipe(10, {
  timeout: 6000
})

function httpRequest(method, url, headers = {}, data = {}) {
  // 封装request请求 post get
  console.log(url, '真实的java接口地址')
  const proxy = util.format('http://%s:%d', '127.0.0.1', 4780)
  if (method == 'get') {
    return function (cb) {
      try {
        // console.log(`request ${this.id} has been sent at: ${start}` );
        request(
          {
            url: url,
            method: 'GET',
            data,
            headers,
            proxy
          },
          function (error, response, body) {
            cb(error, body)
          }
        )
      } catch (err) {
        console.error('response data error', err)
        cb(err, null)
      }
    }.bind(this)
  } else if (method == 'post') {
    return function (cb) {
      try {
        request(
          {
            url: requestUrl,
            method: 'POST',
            form: data,
            proxy
          },
          function (error, response, body) {
            cb(null, body)
          }
        )
      } catch (err) {
        console.error('response data error', err)
        cb(err, null)
      }
    }.bind(this)
  }
}

const objectToUrlParmas = (obj) => {
  let query = ''
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const element = obj[key]
      query += key + '=' + element + '&'
    }
  }
  return query.slice(0, query.length - 1)
}

/**
 * http 请求封装
 * @param    {[string]}                     type   [请求类型]
 * @param    {[string]}                     url    [请求地址]
 * @param    {[json/array]}                 data   [请求数据]
 * @param    {[object]}                     header [请求header]
 * @param    {[bool]}                       debug  [是否打印请求信息]
 * @return   {[promise]}                            [promise]
 * @Author:  slade
 * @DateTime :2017-09-15T10:30:42+080
 */
function httpRequest2(url, data = {}, type = 'GET', header = {}, debug = false) {
  // 数据
  let options = {
    url: url,
    headers: header,
    method: type
  }
  if (type.toLowerCase() === 'post') {
    options = Object.assign(options, {
      body: JSON.stringify(data)
    })
  } else if (type.toLowerCase() === 'get') {
    options.url = url + '?' + objectToUrlParmas(data)
  }
  const proxy = util.format('http://%s:%d', '127.0.0.1', 4780)

  console.log('开始请求' + type, options.url)

  // options.proxy = proxy

  // console.log('请求参数',options)
  // 调用
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (debug) {
        console.log('请求返回\n', response)
        console.log('请求返回内容\n', body)
        console.error('请求错误\n', error)
      }
      if (!error && response.statusCode == 200) {
        try {
          // var info = typeof body === 'Object' ? body : JSON.parse( body )

          console.log('url\n', url, 'success')
          resolve(body)
        } catch (e) {
          console.log('url\n', url)
          console.log('参数', options)
          console.log('请求返回内容\n', body)
          bagpipe.push(httpRequest2, url, options.body, options.method, options.headers, debug)
          reject(e)
        }
      } else {
        console.log('url\n', url)
        console.log('参数', options)
        console.log('请求返回内容\n', body)
        bagpipe.push(httpRequest2, url, options.body, options.method, options.headers, debug)
        reject(error)
      }
    })
  })
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time * 1000)
  })
}

module.exports = {
  httpRequest,
  httpRequest2,
  sleep
}
