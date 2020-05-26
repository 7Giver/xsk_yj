const baseURL = 'https://apis.53pzck.top'
//把obj对象里的值覆盖到newobj里面
function deepCopy(newobj, obj) {
  if (typeof obj != 'object') {
    return obj
  }
  for (var attr in obj) {
    var a = {}
    if (newobj[attr]) {
      a = newobj[attr]
    }
    newobj[attr] = deepCopy(a, obj[attr])
  }
  return newobj
}

//跳转到登陆页面
function _jumpToLogin(method) {
  uni.showToast({
    title: '请先登录!',
    icon: 'none',
    duration: 1000,
    success: function(res) {
      // #ifdef H5 || APP-PLUS
      setTimeout(() => {
        uni.hideToast();
        uni.navigateTo({
          url: '/pages/login/login'
        })
      }, 1000)
      // #endif
      // #ifdef MP-WEIXIN || MP-ALIPAY
      setTimeout(() => {
        uni.hideToast();
        uni.navigateTo({
          url: '/pages/login/choose',
          animationType: 'pop-in',
          animationDuration: 200
        })
      }, 500)
      // #endif
    }
  })
}

//跳转到登陆页面
function jumpToLogin(method) {
  uni.showToast({
    title: '请先登录!',
    icon: 'none',
    duration: 1000,
    success: function(res) {
      setTimeout(() => {
        uni.hideToast();
        uni.navigateTo({
          url: '/pages/login/base',
          animationType: 'pop-in',
          animationDuration: 200
        })
      }, 1000)
    }
  })
}


//操作成功后，的提示信息
function successToShow(msg = '保存成功', callback = function() {}) {
  uni.showToast({
    title: msg,
    icon: 'success',
    duration: 1000
  })
  setTimeout(function() {
    callback()
  }, 500)
}

//操作失败的提示信息
function errorToShow(msg = '操作失败', callback = function() {}) {
  uni.showToast({
    title: msg,
    icon: 'none',
    duration: 1500
  })
  setTimeout(function() {
    callback()
  }, 1500)
}

//加载显示
function loadToShow(msg = '加载中') {
  uni.showToast({
    title: msg,
    icon: 'loading'
  })
}

//加载隐藏
function loadToHide() {
  uni.hideToast()
}

// 提示框
function modelShow(
  title = '提示',
  content = '确认执行此操作吗?',
  callback = () => {},
  showCancel = true,
  cancelText = '取消',
  confirmText = '确定'
) {
  uni.showModal({
    title: title,
    content: content,
    showCancel: showCancel,
    cancelText: cancelText,
    confirmText: confirmText,
    success: function(res) {
      if (res.confirm) {
        // 用户点击确定操作
        setTimeout(() => {
          callback()
        }, 500)
      } else if (res.cancel) {
        // 用户取消操作
      }
    }
  })
}

//时间戳转时间格式
function timeToDate(date, flag = false) {
  var date = new Date(date * 1000) //如果date为13位不需要乘1000
  var Y = date.getFullYear() + '-'
  var M =
    (date.getMonth() + 1 < 10 ?
      '0' + (date.getMonth() + 1) :
      date.getMonth() + 1) + '-'
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var m =
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  if (flag) {
    return Y + M + D
  } else {
    return Y + M + D + h + m + s
  }
}

//验证是否是手机号
function isPhoneNumber(str) {
  var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
  if (!myreg.test(str)) {
    return false
  } else {
    return true
  }
}

/**
 *
 * 对象参数转为url参数
 *
 */
function builderUrlParams(url, data) {
  if (typeof url == 'undefined' || url == null || url == '') {
    return ''
  }
  if (typeof data == 'undefined' || data == null || typeof data != 'object') {
    return ''
  }
  url += url.indexOf('?') != -1 ? '' : '?'
  for (var k in data) {
    url += (url.indexOf('=') != -1 ? '&' : '') + k + '=' + encodeURI(data[k])
  }
  return url
}


/**
 * 统一跳转
 */
function navigateTo(url) {
  uni.navigateTo({
    url: url,
    animationType: 'pop-in',
    animationDuration: 300
  })
}

function switchTab(url) {
  uni.switchTab({
    url: url,
    animationType: 'pop-in',
    animationDuration: 300
  })
}
/**
 *  关闭当前页面并跳转
 */
function redirectTo(url) {
  uni.redirectTo({
    url: url,
    animationType: 'pop-in',
    animationDuration: 300
  })
}

/**
 * 获取url参数
 *
 * @param {*} name
 * @param {*} [url=window.location.serach]
 * @returns
 */
function getQueryString(name, url) {
  var url = url || window.location.href
  var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
  var r = url.substr(1).match(reg)
  if (r != null) {
    return r[2]
  }
  return null
}

/**
 *
 *  判断是否在微信浏览器 true是
 */
function isWeiXinBrowser() {
  // #ifdef H5
  // window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
  let ua = window.navigator.userAgent.toLowerCase()
  // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
  // #endif

  return false
}

/**
 * 金额相加
 * @param {Object} value1
 * @param {Object} value2
 */
function moneySum(value1, value2) {
  return (parseFloat(value1) + parseFloat(value2)).toFixed(2);
}
/**
 * 金额相减
 * @param {Object} value1
 * @param {Object} value2
 */
function moneySub(value1, value2) {
  let res = (parseFloat(value1) - parseFloat(value2)).toFixed(2);
  return res > 0 ? res : 0;
}
/**
 * H5授权跳转
 */
function authH5() {
  let url = encodeURIComponent(location.href)
  location.href = `${baseURL}/addons/xshop/wechat/index?path=${url}`
  return false
}
export {
  deepCopy,
  jumpToLogin,
  timeToDate,
  successToShow,
  errorToShow,
  isPhoneNumber,
  loadToShow,
  loadToHide,
  navigateTo,
  switchTab,
  redirectTo,
  modelShow,
  builderUrlParams,
  isWeiXinBrowser,
  getQueryString,
  moneySum,
  moneySub,
  authH5
}
