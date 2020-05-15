<template>
  <view class="container">
    <view class="audit-outer" v-if="is_succ == 1">
      <image class="succ" src="https://cdn.swh296.com/img/iconList/do_success.png" mode=""></image>
      <view class="content">
        <text class="state">恭喜，审核通过！</text>
        <view class="tip">
          <text>您离加盟入驻仅差一步啦，</text>
          <text>点击以下按钮开启事业之旅吧！</text>
        </view>
      </view>
      <button class="cu-btn s-bg-linear" @click="_handleAudit">前往缴纳保证金</button>
    </view>
    <view class="audit-outer" v-if="is_succ == 2">
      <image class="succ" src="https://cdn.swh296.com/img/common/empty_content.png" mode=""></image>
      <view class="content err">
        <text class="state">哎呀，有点小问题需要修改哦</text>
      </view>
      <button class="cu-btn s-bg-linear" @click="_handleAudit">修改信息</button>
    </view>
  </view>
</template>

<script>
  export default{
    data(){
      return {
        is_succ:-1
      }
    },
    onLoad(options) {
      this.is_succ = options.audit_status
    },
    methods: {
      _handleAudit() {
        if(this.is_succ == 1){
          uni.navigateTo({
            url:'/pages/merchant_enter/pay'
          })
        }else{
          uni.navigateTo({
            url:'/pages/merchant_enter/merchant_enter'
          })
        }
      }
    },
  }
</script>

<style lang="scss">
  @import 'mixin.scss';
  page,.container{
    width: 100%;
    height: 100%;
    background-color: #fff;
    .audit-outer{
      width: 100%;
      padding-top: 100rpx;
      @include flexY;
      @include flexJ;
      @include flexA;
      .succ{
        width: 220rpx;
        height: 220rpx;
        margin-bottom: 45rpx;
      }
      .content{
        @include flexY;
        @include flexJ;
        @include flexA;
        &.err{
          margin-bottom: 130rpx;
        }
        .state{
          color: #666666;
          font-size: 30rpx;
          text-align: center;
        }
        .tip{
          @include flexY;
          @include flexJ;
          @include flexA;
          color: #999999;
          font-size: 28rpx;
          margin: 10rpx auto 60rpx;
        }
      }
      .cu-btn{
        width:500rpx;
        height:90rpx;
        background:linear-gradient(-90deg,rgba(242,106,83,1) 0%,rgba(238,67,39,1) 100%);
        border-radius:45rpx;
        color: #fff;
        font-size: 34rpx;
      }
    }
  }
</style>
