var rp = require('request-promise')

const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  res = rp('https://api.douban.com/v2/book/isbn/' + event.isbn).then(html => {
    return html;
    console.log(html)
  }).catch(err => {
    console.log(err)
  });
  // 这里获取到的 openId、 appId 和 unionId 是可信的，注意 unionId 仅在满足 unionId 获取条件时返回
  let { OPENID, APPID } = cloud.getWXContext();
  console.log("+++++++++++++")
  console.log(res);
  return res;
}