Page({

  /**
   * 页面的初始数据
   */
  data: {
    input_val: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
   *点击扫码增加图书
   */
  scancode: function(res) {

    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode'],
      success: res => {
        console.log(res)

        wx.cloud.callFunction({
          // 云函数名称
          name: 'bookinfo',
          // 传给云函数的参数
          data: {
            isbn: res.result
          },
          success: res => {
            var bookString = res.result;
            console.log(JSON.parse(res.result)) // 3

            //获取数据库的引用
            const db = wx.cloud.database()

            // 初始化数据库
            const books = db.collection('mybook');

            //插入数据库
            db.collection('mybook').add({
                // data 字段表示需新增的 JSON 数据
                data: JSON.parse(bookString)
              })
              .then(res => {
                console.log(res)
              }).catch(err => {
                console.log(err)
              })

          },
          fail: error => {
            console.log(error)
          }
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  /*
   *输入isbn添加图书
   */
  formSubmit: function(event) {
    wx.cloud.callFunction({
      //云函数名字
      name:'addbook',
      //传给云函数的参数
      data:{
        isbn: event.detail.value.input
      },
      success: res => {
        var bookString = res.result;
        console.log("云函数打印内容")
        console.log(res)
        console.log(typeof(res.result)) // 3

        //获取数据库的引用
        const db = wx.cloud.database()

        // 初始化数据库
        const books = db.collection('mybook');

        //插入数据库
        db.collection('mybook').add({
          // data 字段表示需新增的 JSON 数据
          data: JSON.parse(bookString)
        })
          .then(res => {
            console.log(res)
          }).catch(err => {
            console.log(err)
          })

      },
      fail:err=>{

      }
    })
  },
})