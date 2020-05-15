<template>
  <!-- <view class="container" :style="{ height: height }"> -->
  <view class="container">
    <!-- <image class="avatar" :src="userInfo.avatar_text" mode=""></image> -->
    <view class="header">
      <image class="avatar" :src="userInfo.avatar_text" mode=""></image>
      <text>{{reg.name}}</text>
    </view>
    <view class="content">
      <view class="item">
        <!-- <image class="left-icon" src="https://cdn.swh296.com/img/iconList/reg_nicheng.png" mode=""></image> -->
        <text class="item-l">昵称</text>
        <input type="text" maxlength="10" v-model="reg.name" placeholder="请输入您的昵称" value="" />
      </view>
      <view class="item">
        <!-- <image class="left-icon" src="https://cdn.swh296.com/img/iconList/reg_tel.png" mode=""></image> -->
        <text class="item-l">手机</text>
        <input class="ver-input" type="number" v-model="reg.tel" maxlength="11" placeholder="请输入您的手机" value="" />
        <view class="ver-text" @click="_getCode" :class="isShowTime ? 'get' : 'time'">{{ ver_text }}</view>
      </view>
      <view class="item mb">
        <!-- <image class="left-icon" src="https://cdn.swh296.com/img/iconList/reg_vertify.png" mode=""></image> -->
        <text class="item-l">验证码</text>
        <input type="number" maxlength="4" v-model="reg.code" placeholder="请输入验证码" value="" />
      </view>
       <view class="aggrement-section">
         <checkbox-group class="block" @change="checkboxChange">
           <checkbox class="round red" style="transform:scale(0.6)" :class="checkbox.checked ? 'checked' : ''" :checked="checkbox.checked ? true : false" value="isRead"></checkbox>
         </checkbox-group>
         <text @click.stop="_toAgreement">阅读并同意用户协议</text>
       </view>
    </view>
    <button class="s-bg-linear"  :disabled="disabled" @click="save">保存</button>
  </view>
</template>

<script>
import { authSetting } from '../../common/js/commonInfo.js';
import { mapState, mapMutations } from 'vuex';
export default {
  data() {
    return {
      disabled: false,
      ver_text: '获取验证码',
      isgetCode: false,
      reg: {
        name: '',
        tel: '',
        code: ''
      },
      checkbox:{
        value: 'isRead',
        checked: false
      },
      isShowTime: true, // 验证码展示
      height: 800,
      sendMsg: false
    };
  },
  computed: {
    ...mapState(['token','userInfo'])
  },
  onLoad() {
    // this.height = uni.getSystemInfoSync().windowHeight + 'px';
    let pages = getCurrentPages();
    let curPage = pages[pages.length - 1];
    this.reg.name = this.userInfo.nickname || uni.getStorageSync('state_userInfo').nickname 
    console.log(pages[0].route);
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'setUserInfo',
      setToken: 'setToken'
    }),
    _toAgreement(){
      console.log('1')
      uni.navigateTo({
        url:'/pages/aggrement/aggrement'
      })
    },
    checkboxChange(e) {
      var items = this.checkbox,
        values = e.detail.value;
        items.checked = !items.checked
        this.isChecked = values.length>0 ?true:false
    },
    save() {
      var myreg = /^(1)[0-9]{10}$/;
      if(this.reg.name.trim() ==''){
        this.$api.msg('请输入您的昵称')
        return 
      }
      if(this.reg.tel.trim() ==''){
        this.$api.msg('请输入手机号')
        return 
      }
      if(!myreg.test(this.reg.tel)){
        this.$api.msg('手机号有误!')
        return 
      }
      if(this.reg.code.trim() ==''){
        this.$api.msg('请输入验证码')
        return 
      }
      if(this.reg.code.length !=4){
        this.$api.msg('验证码有误!')
        return 
      }
      if(!this.checkbox.checked){
        this.$api.msg('请阅读并同意用户协议')
        return
      }
      console.log(this.reg)
      this.disabled = true
      this.profile()
    },
    _getCode() {
      if (!this.sendMsg) {
        this.sendMsg = true;
        this.get_verify_code();
      }
    },
    profile(){
      this.$http
        .post(`/api/user/profile`,{
          token:this.token,
          mobile:this.reg.tel,
          code:this.reg.code,
          nickname:this.reg.name
        })
        .then(response => {
          const data = response.data;
          console.log(response)
          if (response.code == 1) {
            console.log('this.is')
            this.$api.msg(response.msg)
            this.disabled = false
            this.setUserInfo(data.userinfo)
            this.setToken(data.userinfo.token)
            // uni.switchTab({
            //   url:'/pages/mine/index'
            // })
            setTimeout(()=>{
              uni.navigateBack()
            },500 )
          }else{
            this.disabled = false
            this.$api.msg(response.msg)
          }
        });
    },
    get_verify_code(){
      var _this = this
      this.$http
        .post(`/api/merchants/coins/sendMsg`,{
          token:this.token,
          tel:this.reg.tel
        })
        .then(response => {
          const data = response.data;
          console.log(response)
          if (response.code == 1) {
            let countdown = 60
            const timer = setInterval(function() {
              countdown--;
              if (countdown === 0) {
                _this.sendMsg = false;
                _this.isShowTime = true;
                _this.ver_text = '获取验证码';
                countdown = 60;
                clearInterval(timer);
              } else {
                _this.isShowTime = false;
                _this.ver_text = countdown + 's';
              }
            }, 1000)
          }
        });
    }
  }
};
</script>

<style lang="scss">
@import 'mixin.scss';
page,.container{
 height: 100%;
 background-color: #FFFFFF; 
}
/deep/uni-checkbox:not([disabled]) .uni-checkbox-input:hover {
  border-color: #e54d42;
}
.container {
  width: 100%;
  // background-image: url('https://cdn.swh296.com/img/mine/reg_bg.png');
  // background-size: 100% 100%;
  @include flexY;
  @include flexA;
  // overflow: hidden;
  .avatar {
    width: 150rpx;
    height: 150rpx;
    border-radius: 50%;
    margin: 220rpx auto 70rpx;
  }
  .header{
    width: 100%;
    height: 480rpx;
    background-image: url('https://cdn.swh296.com/img/mine/reg_header.png');
    background-size: 100% 100%;
    @include flexY;
    @include flexA;
    color: #FFF1F0;
    font-size: 34rpx;
    .avatar{
      width: 150rpx;
      height: 150rpx;
      border-radius: 50%;
      margin: 70rpx auto 25rpx;
    }
    .name{
      
    }
  }
  .content {
    width: 690rpx;
    // height: 550rpx;
    margin-top: -130rpx;
    background-image: url('https://cdn.swh296.com/img/mine/reg_content.png');
    background-size: 100% 100%;
    padding: 60rpx 53rpx 20rpx;
    font-size: 30rpx;
    border-radius: 5rpx;
    .aggrement-section{
      margin-top: 15rpx;
      @include flexX;
      @include flexA;
      @include flexJ;
      color: #999;
      font-size: 26rpx;
    }
    // color: #999;
    .item {
      width: 600rpx;
      height: 110rpx;
      background: #fff;
      border-radius: 55rpx;
      @include flexX;
      margin-bottom: 40rpx;
      &.mb{
        margin-bottom:0
      }
      .item-l{
        margin: 0 45rpx;
        color: #999999;
        width: 15%;
      }
      .left-icon {
        width: 44rpx;
        height: 44rpx;
        margin: 0 15rpx;
      }
      input {
        flex: 1;
        color: #333;
      }
      .ver-text {
        position: relative;
        margin-right: 20rpx;
        height: 68rpx;
        line-height: 68rpx;
        width: 145rpx;
        text-align: center;
        font-size: 26rpx;
        color: #f5634b;
        &.time {
          color: #999;
        }
        &::before {
          content: '';
          position: absolute;
          width: 1px;
          height: 28rpx;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  .s-bg-linear {
    width:600rpx;
    margin-top: 40rpx;
    font-size: 36rpx;
    color: #fff;
    height:90rpx;
    background:linear-gradient(90deg,rgba(245,75,101,1),rgba(248,131,96,1));
    border-radius:45rpx;
  }
}
</style>
