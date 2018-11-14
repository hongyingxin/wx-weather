const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:[],
    bookList:[],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    page:0,
    count:8,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.database_init();

    this.booklist();

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
    console.log("onPullDownRefresh")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("onReachBottom")
    this.booklist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /*
  * 初始化数据
  */
  database_init: function(){

    db.collection('banner').get().then(res => {

      var arr = [];
      var one = res.data.slice(0,3);
      var two = res.data.slice(3,6);
      var three = res.data.slice(6,9);
      arr.push(one,two,three);
      this.setData({
        banner: arr
      })

    }).catch(err => {
      console.log(err)
    })

  },

  booklist:function(){

    var that = this;
    var list = that.data.bookList;
    var page = that.data.page;
    var count = that.data.count;


    db.collection('mybook').skip(page).limit(count).get().then(res => {
      if(res.data.length == 0){
        console.log("底线")
        wx.showToast({
          title: '我是有底线的人',
          image:'../../images/more.png',
          duration: 4000
        })
      }
      this.setData({
        bookList: list.concat(res.data),
        page:page+count
      })
    }).catch(err => {
      console.log(err)
    })

  }

})