import uni_request from 'js_sdk/songGQ-req/uni_request/uni_request.js'
import store from '../../store'
const http = uni_request({
  baseURL: 'https://apis.53pzck.top',
  header: {
    'content-type': 'application/x-www-form-urlencoded',
  },
  timeout: 20000,
  // #ifdef H5
  withCredentials: true
  // #endif
})

export const addCoupon = function(wxData = {}) {
  return new Promise((resolve, reject) => {
    console.log('wxdata', wxData)
    http
      .post(`https://apis.53pzck.top/api/merchants/coupon/add`, wxData)
      .then(response => {
        if (response.code === 1) {
          resolve(response)
        } else {
          uni.showToast({
            title: response.msg,
            duration: 1000
          });
        }
      })
  })
}

export const profile = function(token) {
  return new Promise((resolve, reject) => {
    http
      .post(`/api/user/profile`, {
        token: token
      })
      .then(response => {
        const data = response.data;
        console.log('--profile---',response)
        if (response.code == 1) {
          store.commit('setUserInfo',data.userinfo)
          store.commit('setToken',data.userinfo.token)
          if(!data.userinfo.mobile){
            uni.navigateTo({
              url:'/pages/login/register'
            })
          }
        } else {
          this.$api.msg(response.msg)
        }
      });
  })
}

export const authSetting = function({
  token
} = {}) {
  return new Promise((resolve, reject) => {
    uni.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success(res) {
              // 如果已经授权,在这里可获取相关数据
              // console.log(res)
              let objData = Object.assign({
                token: token
              }, res.userInfo)
              http
                .post(`/api/user/profile`, objData)
                .then(response => {
                  const data = response.data
                  if (response.code == 1) {
                    resolve(response)
                  }
                })
            },
            fail(err) {
              // 错误信息
              console.log(err)
            }
          })
        }
      }
    })
  })
}
// 获取地址
export const authSettingLocation = function(callback) {
  return new Promise((resolve, reject) => {
    uni.getLocation({
        type: 'wgs84',
        success: function (res) {
            uni.chooseLocation({
                success: function (res) {
                    if(typeof callback =='function'){
                      callback(res)
                    }
                }
            });
        },fail(err) {
          console.warn('err',err)
          if(typeof callback =='function'){
            callback(err)
          }
        }
    });
    // uni.getSetting({
    //   success(res) {
    //     console.log('uni.getSetting',res)
    //     if (res.authSetting['scope.userLocation']) {
    //       uni.chooseLocation({
    //           success: function (res) {
    //               // console.log('位置名称：' + res.name);
    //               // console.log('详细地址：' + res.address);
    //               // console.log('纬度：' + res.latitude);
    //               // console.log('经度：' + res.longitude);
    //               if(typeof callback =='function'){
    //                 callback(res)
    //               }
    //           }
    //       });
    //     }else{
    //       uni.authorize({
    //           scope: 'scope.userLocation',
    //           success() {
    //               uni.getLocation({
    //                   type: 'wgs84',
    //                   success: function (res) {
    //                       uni.chooseLocation({
    //                           success: function (res) {
    //                               // console.log('位置名称：' + res.name);
    //                               // console.log('详细地址：' + res.address);
    //                               // console.log('纬度：' + res.latitude);
    //                               // console.log('经度：' + res.longitude);
    //                               if(typeof callback =='function'){
    //                                 callback(res)
    //                               }
    //                           }
    //                       });
                    
    //                   }
    //               });
    //           }
    //       })
    //     }
    //   }
    // })
  })
}
//打开地图
export function chooseLocation(callback){
    // 先判断定位权限是否开启
    uni.getLocation({
        type: 'wgs84',
        success(res){
            //定位权限开启，打开地图
            uni.chooseLocation({
                success: function (res) {
                    if(typeof callback =='function'){
                      callback(res)
                    }
                }
            });
        },
        fail(e) {
            // 定位权限未开启，引导设置
            uni.showModal({
                title: '温馨提示',
                content: '您已拒绝定位,请开启',
                confirmText: '去设置',
                success(res){
                    if (res.confirm) {
                        //打开授权设置
                        openSetting()
                    }
                }
            })
        }
        
        
        
    })
}

//打开授权设置（必须用户点击小程序才能打开授权设置，所以前面加了showModel）
export function openSetting(){
    // 打开小程序的设置
    // #ifdef MP-WEIXIN
    uni.openSetting({
      success(res) {
        console.log(res.authSetting)
      }
    });
    // #endif
    
    // App跳转系统的设置界面
    // #ifdef APP-PLUS
    uni.getSystemInfo({
        success(res) {
            if(res.platform=='ios'){ //IOS
                plus.runtime.openURL("app-settings://");
            } else if (res.platform=='android'){ //安卓
                let main = plus.android.runtimeMainActivity();
                let Intent = plus.android.importClass("android.content.Intent");
                let mIntent = new Intent('android.settings.ACTION_SETTINGS');
                main.startActivity(mIntent);
            }
        }
    });
    // #endif
}
// 获取gethome接口
export const getBrandData = function({
  token,
  vid,
  bid
} = {}) {
  return new Promise((resolve, reject) => {
    request
      .get(`/signIn/getBrandData`, {
        token: token,
        vid: vid,
        bid: bid
      })
      .then(response => {
        console.log('--getBrandData response--', response)
        const data = response.data
        // that.setStateData(['prodData',{qtyList:a}]);
        if (response.errCode === 0) {
          resolve(data)
          // that.setStateData(['prodData',{qtyList:a}]);
        }
      })
  })
}
export const updateVisitor = function(wxData = {}) {
  return new Promise((resolve, reject) => {
    let data = {
      token: wxData.token,
      vid: wxData.vid,
      code: wxData.code,
      encryptedData: wxData.encryptedData,
      iv: wxData.iv,
      city: wxData.city,
      avatarUrl: wxData.avatarUrl,
      country: wxData.country,
      gender: wxData.gender,
      language: wxData.language,
      nickName: wxData.nickName,
      province: wxData.province,
    }
    uni.request({
      url: `${baseURL}/visitor/updateVisitor`,
      method: "POST",
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(response) {
        console.log('updateVisitor--response', response)
        // const data = response.data.data
        if (response.data && response.data.errCode === 0) {
          resolve(response.data.errCode)
        } else {
          uni.showToast({
            title: response.msg,
            duration: 1000
          });
        }
      }
    });
  })
}
export const mergeUnionId = function({
  token,
  vid,
  code,
  encryptedData,
  iv
} = {}) {
  return new Promise((resolve, reject) => {
    let data = {
      token: token,
      vid: vid,
      code: code,
      encryptedData: encryptedData,
      iv: iv
    }
    uni.request({
      url: `${baseURL}/visitor/mergeUnionId`,
      method: "POST",
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(response) {
        console.log('response', response)
        const data = response.data
        resolve(data)
        if (response.errCode === 0) {
          // resolve(data)
        } else {
          uni.showToast({
            title: response.msg,
            duration: 1000
          });
        }
      }
    });
  })
}
