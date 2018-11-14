// 云函数入口文件
const cloud = require('wx-server-sdk')
// 请先调用 init 完成初始化后再调用其他云 API。init 方法可传入一个对象用于设置默认配置，详见文档
cloud.init()
// const db = wx.cloud.database()    小程序h获取
const db = cloud.database() //云函数获取

// 云函数入口函数
exports.main = async(event, context) => {

  try {
    // 这里获取到的 openId、 appId 和 unionId 是可信的，注意 unionId 仅在满足 unionId 获取条件时返回
    const {
      OPENID,
      APPID,
      UNIONID,
    } = cloud.getWXContext()

    return await db.collection('mybook').where({
      _openid: OPENID
    })
      .get()
  } catch (e) {
    console.error(e)
  }

  // let ss = await db.collection('mybook').get().then(res => {
  //   console.log(res)
  //   return res;
  // }).catch(err => {
  //   console.log(err)
  // })

  // return ss;
}