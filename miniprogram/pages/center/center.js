import Toast from '../../dist/toast/toast';

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    percentage: 0,
    now_date: 0,
    count: 0, // 设置 计数器 初始为0
    countTimer: null, // 设置 定时器 初始为null
    step:0    //圆弧度 
  },
  onLoad: function() {

    console.log("+++++")

    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {}
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //查看是否登录
    this.onGetOpenid();

    this.nowDate();

    this.drawProgressbg();

    this.countInterval();

  },

  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        // app.globalData.openid = res.result.openid
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
  nowDate: function () {
    //现在时间
    var timerToday = new Date().getTime();;
    //目标时间
    var timerBirthday = new Date("2019/1/1").getTime();
    //计算过去天数
    var dayNum = parseInt((timerToday - timerBirthday) / 1000 / 3600 / 24);
    var percentageNum = parseInt(dayNum / 365 * 100);

    var stepNum = (dayNum / 362 * 2).toFixed(1);
    this.setData({
      now_date: dayNum,
      percentage: percentageNum,
      step:stepNum
    })
  },
  drawProgressbg: function() {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth(3); // 设置圆环的宽度
    ctx.setStrokeStyle('#e8e8e8'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath(); //开始一个新的路径
    ctx.arc(110, 110, 100, 0, 2 * Math.PI, false);
    //设置一个原点(110,110)，半径为100的圆的路径到当前路径
    ctx.stroke(); //对当前路径进行描边
    ctx.draw();
  },
  drawCircle: function(step) {
    var context = wx.createCanvasContext('canvasProgress');
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#2661DD");
    gradient.addColorStop("0.5", "#40ED94");
    gradient.addColorStop("1.0", "#5956CC");

    context.setLineWidth(8);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(110, 110, 100, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },
  countInterval: function() {
    // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
    this.countTimer = setInterval(() => {
      if (this.data.count <= 60) {
        /* 绘制彩色圆环进度条  
        注意此处 传参 step 取值范围是0到2，
        所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
        */
        this.drawCircle(this.data.count / (60 / this.data.step))
        this.data.count++;
      } else {
        clearInterval(this.countTimer);
      }
    }, 100)
  },
  /*
  *点击扫码增加图书
  */
  scancode: function (res) {

    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode'],
      success: res => {
        wx.showLoading({
          title: '添加图书中...',
        })
        console.log(res)

        wx.cloud.callFunction({
          // 云函数名称
          name: 'bookinfo',
          // 传给云函数的参数
          data: {
            isbn: res.result
          },
          success: res => {
            if (res.result == "查无图书"){
              wx.hideLoading();
              Toast.fail('查无图书');
            }else{
              var bookString = res.result;
              console.log(res)
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
                  wx.hideLoading();
                  Toast.success('添加成功');
                  console.log(res)
                }).catch(err => {
                  console.log(err)
                })
            }

          },
          fail: error => {
            console.log(error)
          }
        })
      },
      fail: err => {
        Toast.fail('扫码失败');
        console.log(err)
      }
    })
  },

  /*
   *输入isbn添加图书
   */
  formSubmit: function (event) {
    if(event.detail.value.input ==""){
      Toast('请输入ISBN码');
      return;
    }
    wx.showLoading({
      title: '添加图书中...',
    })
    wx.cloud.callFunction({
      //云函数名字
      name: 'addbook',
      //传给云函数的参数
      data: {
        isbn: event.detail.value.input
      },
      success: res => {
        if (res.result == "查无图书") {
          wx.hideLoading();
          Toast.fail('查无图书');
        }else{
          var bookString = res.result;
          console.log("云函数打印内容")
          console.log(res)

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
              wx.hideLoading();
              Toast.success('添加成功');
              console.log(res)
            }).catch(err => {
              console.log(err)
            })
        }
      
      },
      fail: err => {

      }
    })
  },
})