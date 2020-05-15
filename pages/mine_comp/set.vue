<template>
 <view class="content">
   <view class="info-section">
      <view class="item">
        <text class="item-l">个人头像</text>
        <view class="item-r">
          <image :src="userInfo.avatar_text" mode=""></image>
          <!-- <view class="change">更换头像</view> -->
        </view>
      </view>
      <view class="item">
        <text class="item-l">昵称</text>
        <view class="item-r-input">
          <input type="text" maxlength="9" v-model="info.name" placeholder="请输入您的昵称" value="" />
        </view>
      </view>
      <view class="item">
        <text class="item-l">手机</text>
        <view class="item-r-input">
          <input type="number" maxlength="11" v-model="info.tel" placeholder="请输入您的手机号" value="" />
        </view>
        <!-- <view class="item-r-text">167778888888</view> -->
      </view>
    </view>
    <button class="save-btn" :disabled="disabled" @click="_save" :loading="disabled">保存</button>
  </view>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
export default {
  data() {
    return {
      info:{
        name:'',
        tel:''
      },
      disabled:false
    }
  },
  computed: {
   ...mapState(['userInfo','token'])
  },
  onLoad() {
    this.info ={
      name:this.userInfo.nickname,
      tel:this.userInfo.mobile,
    }
  },
  methods: {
    ...mapMutations({
      setUserInfo:'setUserInfo'
    }),
    _save(){
      var myreg = /^(1)[0-9]{10}$/;
      if(this.info.name.trim() ==''){
        this.$api.msg('请输入您的昵称')
        return 
      }
      if(this.info.tel.trim() ==''){
        this.$api.msg('请输入手机号')
        return 
      }
      if(!myreg.test(this.info.tel)){
        this.$api.msg('手机号有误!')
        return 
      }
      this.disabled = true
      this.profile()
    },
    profile(){
      this.$http
        .post(`/api/user/profile`,{
          token:this.token,
          mobile:this.info.tel,
          nickname:this.info.name
        })
        .then(response => {
          const data = response.data;
          console.log(response)
          if (response.code == 1) {
            console.log('this.is')
            this.$api.msg(response.msg)
            this.disabled = false
            this.setUserInfo(data.userinfo)
            setTimeout(()=>{
              uni.navigateBack()
            },500)
          }else{
            this.disabled = false
            this.$api.msg(response.msg)
          }
        });
    },
  }
};
</script>

<style lang="scss">
@import 'mixin.scss';
page {
  background-color: #fff;
  color: #333537;
}
.content {
  .info-section {
    .item {
      height: 100rpx;
      padding: 0 32rpx;
      @include flexSB;
      border-bottom:1px solid #e8e8e8;
      font-size: 32rpx;
      &:first-child{
        height: 130rpx;
      }
      .item-r {
        width: 100rpx;
        height: 100rpx;
        border: 2px solid #ebe5e0;
        border-radius: 50%;
        position: relative;
        image {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        .change {
          position: absolute;
          width: 96%;
          bottom: 0;
          left:2%;
          height: 35rpx;
          line-height: 35rpx;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 0 0 51rpx 51rpx;
          font-size: 18rpx;
          color: #fff;
          text-align: center;
        }
      }
      .item-r-input {
        input{
          text-align: right;
        }
      }
    }
  }
  .save-btn{
    @include s-button;
    margin: 100rpx auto;
  }
}
</style>
