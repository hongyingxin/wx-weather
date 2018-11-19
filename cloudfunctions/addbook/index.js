var rp = require('request-promise')

const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  res = rp('https://api.douban.com/v2/book/isbn/' + event.isbn).then(html => {
    return html;
    console.log(html)
  }).catch(err => {
    return "查无图书"
    console.log(err)
  });

}