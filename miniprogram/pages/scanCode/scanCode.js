const db = wx.cloud.database()
const todos = db.collection('banner')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:[],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.database_init();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /*
  * 
  */
  database_init: function(){

    db.collection('banner').get().then(res => {
      // res.data 包含该记录的数据
      // this.setData({
      // booklist: res.data
      // })
      console.log(res.data)

      var arr = [];
      var one = res.data.slice(0,3);
      var two = res.data.slice(3,6);
      var three = res.data.slice(6,9);
      arr.push(one,two,three);
      console.log(arr)
      this.setData({
        banner: arr
      })

    }).catch(err => {
      console.log(err)
    })
  },

})