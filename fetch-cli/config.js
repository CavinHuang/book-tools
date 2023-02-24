const path = require('path')

const headers = {
  'content-type': 'application/json',
  cookie: '_ga=GA1.2.678613742.1647855206; __tea_cookie_tokens_2608=%257B%2522user_unique_id%2522%253A%25226901189438177723912%2522%252C%2522web_id%2522%253A%25226901189438177723912%2522%252C%2522timestamp%2522%253A1647430402969%257D; n_mh=ZMcf8COS3eQsQecNBcC4UbXQAhICGh7yWpcMIjPF9Hg; passport_csrf_token=73185573b0ec3d10f3b52d1cbba33f26; passport_csrf_token_default=73185573b0ec3d10f3b52d1cbba33f26; sid_guard=00b852ae9e481118846a7ba18e97c7f6%7C1653982621%7C31536000%7CWed%2C+31-May-2023+07%3A37%3A01+GMT; uid_tt=9acb2ea6469bf701e39a6ee08260ea77; uid_tt_ss=9acb2ea6469bf701e39a6ee08260ea77; sid_tt=00b852ae9e481118846a7ba18e97c7f6; sessionid=00b852ae9e481118846a7ba18e97c7f6; sessionid_ss=00b852ae9e481118846a7ba18e97c7f6; sid_ucp_v1=1.0.0-KDQ4MmJlYmViNmZmMzlmMmY5NjllNjA2YjZhMDlmZTVkMTI0NDk1OGEKFgiN-8C-_fXZBRCdi9eUBhiwFDgIQAsaAmxmIiAwMGI4NTJhZTllNDgxMTE4ODQ2YTdiYTE4ZTk3YzdmNg; ssid_ucp_v1=1.0.0-KDQ4MmJlYmViNmZmMzlmMmY5NjllNjA2YjZhMDlmZTVkMTI0NDk1OGEKFgiN-8C-_fXZBRCdi9eUBhiwFDgIQAsaAmxmIiAwMGI4NTJhZTllNDgxMTE4ODQ2YTdiYTE4ZTk3YzdmNg; _tea_utm_cache_2608={%22utm_source%22:%22gold_browser_extension%22}; _gid=GA1.2.461249740.1658110039; MONITOR_WEB_ID=17e5a8a5-4f89-42ca-b184-594101714258',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
}

const bookPath = path.resolve(__dirname, '../books')


module.exports = {
  headers,
  bookPath
}