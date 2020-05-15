<script>
/**
 * vuex管理登陆状态，具体可以参考官方登陆模板示例
 */
import { mapMutations } from 'vuex';
export default {
  methods: {
    ...mapMutations(['login'])
  },
  onLaunch: function() {
    let userInfo = uni.getStorageSync('userInfo') || '';
    if (userInfo.id) {
      //更新登陆状态
      uni.getStorage({
        key: 'userInfo',
        success: res => {
          // this.login(res.data);
        }
      });
    }
  },
  onShow: function() {
    var _this = this;
    console.log('App--Show');
    // #ifdef MP-WEIXIN
    console.log('MP-WEIXIN');
    uni.getProvider({
      service: 'oauth',
      success: function(res) {
        console.log('getProvider',res)
        if (~res.provider.indexOf('weixin')) {
          uni.login({
            provider: 'weixin',
            success: function(loginRes) {
              _this.setCode(loginRes.code);
              _this.wxMPLogin(loginRes.code);
            }
          })
        }
      }
    })
    // #endif
    // #ifdef H5
    // https://apis.53pzck.top/addons/xshop/wechat/index?path=https://www.baidu.com
    // https://apis.53pzck.top/addons/xshop/h5/share?url=https://www.baidu.com
    if (this.$jwx && this.$jwx.isWechat()) {
      // console.log('this.$jwx',this.$jwx.isWechat())
      // //检查是否是微信环境
      // let uniToken = this.token || uni.getStorageSync('state_token')
      // console.log('uniToken',uniToken)
      // if(!uniToken){
      //   console.log('!this.userData.token')
      //   if(location.href.indexOf('token')>=0){
      //     let token = this.$common.getQueryString('token')
      //     this.profile(token)
      //   }else{
      //     console.log('url',url)
      //     let url = encodeURIComponent(location.href)
      //     location.href = `${this.$baseURL}/addons/xshop/wechat/index?path=${url}`
      //     console.log('url',url)
      //     return false
      //   }
      // }
    }
    // #endif
  },
  methods: {
    ...mapMutations({
      // add: 'setStateData', // 将 `this.add()` 映射为 `this.$store.commit('increment')`
      setUserData: 'setUserData',
      setUserInfo: 'setUserInfo',
      setCode: 'setCode',
      setToken: 'setToken',
    }),
    profile(token){
      this.$http
        .post(`/api/user/profile`,{
          token:token
        })
        .then(response => {
          const data = response.data;
          console.log(response)
          if (response.code == 1) {
            this.setUserInfo(data.userinfo)
            this.setToken(data.userinfo.token)
          }else{
            this.$api.msg(response.msg)
          }
        });
    },
    wxMPLogin(code) {
      var _this = this;
      this.$http
        .post(`/addons/xshop/index/wxMPLogin`, {
          code: code
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            console.log('data',data)
            if(data.userinfo.token){
              this.setToken(data.userinfo.token);
              this.getUserInfo(data.userinfo.token)
            }else{
              this.setToken('')
              this.setUserInfo({
                avatar: '',
                nickname: '',
                token: '',
                username: '游客',
              });
            }
         
          }
        });
    },
    getUserInfo(token){
      this.$http
        .post(`/api/user/getUserInfo`, {
          token: token
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
           this.setUserInfo(data.userinfo);
          }
        });
    }
  },
  onHide: function() {
    console.log('App Hide');
  }
};
</script>

<style lang="scss">
@import 'colorui/main.css';
@import 'colorui/icon.css';
@import 'icon.css';
@import 'app.scss';
</style>
