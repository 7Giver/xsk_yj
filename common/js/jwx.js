var jweixin = require('jweixin-module')
console.log(jweixin)
export default {
  //判断是否在微信中    
  isWechat: function() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/micromessenger/i) == 'micromessenger') {
      //console.log('是微信客户端')  
      return true;
    } else {
      //console.log('不是微信客户端')  
      return false;
    }
  },
  initJssdk: function(callback) {
    let  platform = uni.getSystemInfoSync().platform
    console.log('warn',platform)
    let href = platform == 'ios' ? uni.getStorageSync('state_ios_href')  : window.location.href
    console.log('warn-href',href)
    var uri = encodeURIComponent(href); //获取当前url然后传递给后台获取授权和签名信息  
    uni.request({
      url: 'https://apis.53pzck.top/addons/xshop/h5/share', //你的接口地址  
      // url:'http://yj-h5-client.asspc.cn/addons/xshop/h5/share',//你的接口地址  
      data: {
        url: uri
      },
      success: (res) => {
        console.log('initJssdk:', res.data)
        //返回需要的参数appId,timestamp,noncestr,signature等  
        //注入config权限配置  
        jweixin.config({
          debug: true,
          appId: res.data.data.appId,
          timestamp: res.data.data.timestamp,
          nonceStr: res.data.data.nonceStr,
          signature: res.data.data.signature,
          jsApiList: [ //这里是需要用到的接口名称  
            'checkJsApi', //判断当前客户端版本是否支持指定JS接口  
            'onMenuShareAppMessage', //分享接口  
            'getLocation', //获取位置  
            'openLocation', //打开位置  
            'scanQRCode', //扫一扫接口  
            'chooseWXPay', //微信支付  
            'chooseImage', //拍照或从手机相册中选图接口  
            'previewImage', //预览图片接口  
            'uploadImage' //上传图片  
          ]
        });
        if (callback) {
          callback(res.data);
        }

      }
    })
  },
  onMenuShareAppMessage: function(shareData,callback) {
    if (!this.isWechat()) {
      //console.log('不是微信客户端')  
      return
    }
    console.log('shareData',shareData)
    jweixin.ready(function() {
      jweixin.onMenuShareAppMessage({
        title: shareData.title, // 分享标题
        desc: shareData.desc, // 分享描述
        link: shareData.shareUrl, // 分享链接
        imgUrl: shareData.imgUrl, // 分享图标
        success(res) {
          if(callback) {
            callback(res)
          }
        }
      })
    })
  },
  //在需要定位页面调用  
  getlocation: function(callback) {
    if (!this.isWechat()) {
      //console.log('不是微信客户端')  
      return;
    }
    this.initJssdk(function(res) {
      jweixin.ready(function() {
        jweixin.getLocation({
          type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'  
          success: function(res) {
            // console.log(res);  
            callback(res)
          },
          fail: function(res) {
            console.log(res)
          },
          // complete:function(res){  
          //     console.log(res)  
          // }  
        });
      });
    });
  },
  openlocation: function(data, callback) { //打开位置  
    if (!this.isWechat()) {
      //console.log('不是微信客户端')  
      return;
    }
    this.initJssdk(function(res) {
      jweixin.ready(function() {
        jweixin.openLocation({ //根据传入的坐标打开地图  
          latitude: data.latitude,
          longitude: data.longitude
        });
      });
    });
  },
  chooseImage: function(callback) { //选择图片  
    if (!this.isWechat()) {
      //console.log('不是微信客户端')  
      return;
    }
    //console.log(data);  
    this.initJssdk(function(res) {
      jweixin.ready(function() {
        jweixin.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album'],
          success: function(rs) {
            callback(rs)
          }
        })
      });
    });
  },
  //微信支付  
  wxpay: function(data, callback) {
    if (!this.isWechat()) {
      //console.log('不是微信客户端')  
      return;
    }
    console.log('微信支付:',data)
    this.initJssdk(function(res) {
      jweixin.ready(function() {
        console.log('微信支付:',data)
        jweixin.chooseWXPay({
          timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符  
          nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位  
          package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）  
          signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'  
          paySign: data.paySign, // 支付签名  
          success: function(res) {
            // console.log(res);  
            callback(res)
          },
          fail: function(res) {
            callback(res)
          },
          // complete:function(res){  
          //     console.log(res)  
          // }  
        });
      });
    });
  }
}
