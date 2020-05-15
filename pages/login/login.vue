<template>
  <view class="container" :style="{ height: height }">
    <button class="s-bg-linear" :disabled="disabled" open-type="getUserInfo" withCredentials="true" @getuserinfo="getuserinfo">微信授权登录</button>
  </view>
</template>

<script>
import { authSetting } from '../../common/js/commonInfo.js';
import { mapState, mapMutations } from 'vuex';
export default {
  data() {
    return {
      disabled: false,
      height: 800
    };
  },
  computed: {
    ...mapState(['token'])
  },
  onLoad(options) {
    this.height = uni.getSystemInfoSync().windowHeight + 'px';
    // let pages = getCurrentPages();
    // let curPage = pages[pages.length-1];
    // console.log(pages,curPage)
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'setUserInfo',
      setToken: 'setToken'
    }),
    wxMPLogin(loginData) {
      var _this = this;
      return new Promise(resolve => {
        this.$http
          .post(`/addons/xshop/index/wxMPLogin`, {
            code: loginData.code,
            encryptedData: loginData.encryptedData,
            iv: loginData.iv
          })
          .then(response => {
            const data = response.data;
            if (response.code === 1) {
              console.log('data', data);
              if (data.userinfo.token) {
                resolve(data.userinfo);
              }
            }
          });
      });
    },
    refreshSessionKey(code) {
      var _this = this;
      return new Promise(resolve => {
        this.$http
          .post(`/addons/xshop/wechatmp/refreshSessionKey`, {
            code: code
          })
          .then(response => {
            const data = response.data;
            if (response.code === 1) {
              console.log('data',data)
                resolve(data)
            }
          })
      });
    },
    // 根据code获得的session_key解析Unionid
    getUnionid(loginData) {
      var _this = this;
      return new Promise(resolve => {
        this.$http
          .post(`/addons/xshop/wechatmp/getUnionid`, {
              confirm_unionid: loginData.confirm_unionid,
              encryptedData: loginData.encryptedData,
              iv: loginData.iv
          })
          .then(response => {
            const data = response.data;
            if (response.code === 1) {
              console.log('data',data)
                resolve(data)
            }
          })
      });
    },
    async getuserinfo(e) {
      console.log(e.detail);
      var _this = this;
      this.disabled = true;
      uni.getProvider({
        service: 'oauth',
        success(res) {
          console.log('getProvider', res);
          if (~res.provider.indexOf('weixin')) {
            uni.login({
              provider: 'weixin',
              success: async function(loginRes) {
                const sessionKeyData =await _this.refreshSessionKey(loginRes.code)
                if(sessionKeyData.type == 2){
                  if (e.detail.userInfo) {
                    const userData = await _this.getUnionid({
                        encryptedData: e.detail.encryptedData,
                        iv: e.detail.iv,
                        confirm_unionid: sessionKeyData.confirm_unionid
                    })
                    const data = await authSetting({
                      token:userData.userinfo.token
                    })
                    if(data.code == 1){
                      //成功
                      _this.$api.msg('授权成功')
                      _this.disabled = false
                      _this.setUserInfo(userData.userinfo)
                      _this.setToken(userData.userinfo.token)
                      setTimeout(()=>{
                        uni.redirectTo({
                          url:'/pages/login/register'
                        })
                      },300)
                    }else{
                      _this.disabled = false
                    }
                  } else {
                    _this.disabled = false;
                  }
                }else{
                  uni.redirectTo({
                    url:'/pages/login/register'
                  })
                }
              }
            });
          }
        }
      });
    }

    // async getuserinfo(e){
    //   console.log(e.detail)
    //   var _this = this
    //   this.disabled = true
    //   if(e.detail.userInfo){
    //     uni.getProvider({
    //       service: 'oauth',
    //         success(res) {
    //         console.log('getProvider',res)
    //         if (~res.provider.indexOf('weixin')){
    //           uni.login({
    //             provider: 'weixin',
    //             success:async function (loginRes) {
    //               const userInfo = await _this.wxMPLogin({
    //                 encryptedData:e.detail.encryptedData,
    //                 iv:e.detail.iv,
    //                 code:loginRes.code
    //               })
    //               console.log('userInfo',userInfo)
    //               // const data = await authSetting({
    //               //   token:userInfo.token
    //               // })
    //               // if(data.code == 1){
    //               //   //成功
    //               //   this.$api.msg('授权成功')
    //               //   this.disabled = false
    //               //   this.setUserInfo(userInfo.userinfo)
    //               //   setTimeout(()=>{
    //               //     uni.redirectTo({
    //               //       url:'/pages/login/register'
    //               //     })
    //               //   },300)
    //               // }else{
    //               //   this.disabled = false
    //               // }
    //             }
    //           });
    //         }
    //       }
    //     })
    //   }else{
    //     this.disabled = false
    //   }
    // }
  }
};
</script>

<style lang="scss">
@import 'mixin.scss';
.container {
  width: 100%;
  background-image: url('https://cdn.swh296.com/img/mine/auth_bg.jpg');
  background-size: 100% 100%;
  @include flexY;
  @include flexJ;
  @include flexA;
  // padding-top: 200rpx;
  .logo {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: 50rpx;
  }
  button {
    width: 80%;
    color: #fff;
  }
}
</style>
