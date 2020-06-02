<template>
  <view class="container">
      <view class="success-inner">
         <image class="icon-success" src="https://cdn.swh296.com/img/appoint/icon_success.png" mode=""></image>
         <text>下单成功</text>
      </view>
      <view class="kf-inner">
          <image class="ewm" @click="_preiview" :src="ewm" mode=""></image>
          <view class="ask">
            <p>请添加客服</p>
            <p>咨询送货上门服务费用</p>
          </view>
      </view>
  </view>
</template>

<script>
  export default {
    data(){
      return {
        ewm:'https://cdn.swh296.com/img/appoint/appoint_text_modal.png'
      }
    },
    methods: {
     _preiview(){
       let urls = []
       urls.push(this.ewm)
       	uni.previewImage({
       		urls: urls
       	})
     }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'mixin.scss';
  page,.container{
    background-color: #F7F9FB;
    color: #757E90;
    font-size: 34rpx;
    .success-inner{
      width: 100%;
      background-color: #fff;
      height: 490rpx;
      border-radius: 0 0 100rpx 100rpx;
      @include flexY;
      @include flexJ;
      @include flexA;
      .icon-success{
        width: 200rpx;
        height: 200rpx;
      }
      text{
        margin-top: 24rpx;
      }
    }
    // .scroll{
    //   width: 100%;
    //   background-color: #fff;
    //   height: 120rpx;
    // }
    .kf-inner{
      width: 100%;
      padding-top: 60rpx;
      @include flexY;
      @include flexJ;
      @include flexA;
      .ewm{
        width: 212rpx;
        height: 212rpx;
        border:4rpx solid rgba(228, 228, 228, 1);
        border-radius:4rpx;
      }
      .ask{
        text-align: center;
        margin-top: 20rpx;
        font-size: 28rpx;
      }
    }
  }
</style>
