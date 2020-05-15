<template>
  <view class="content">
    <textarea class="text-area" value="" v-model="textData" placeholder="请对这次服务做出评价(需要超过20个字才算有效评价)" />
    <button type="primary" class="apply_btn" @click="_apply">提交申请</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      textData: ''
    };
  },

  onLoad(options) {},

  methods: {
    _apply(){
      // console.log(this.textData)
    }
  }
};
</script>

<style lang="scss">
@import 'mixin.scss';
.text-area{
  width:690rpx;
  margin: 40rpx auto;
  padding: 28rpx 20rpx;
  height:268rpx;
  background:rgba(242,242,242,1);
  border-radius:6rpx;
}
.apply_btn{
  width:660rpx;
  margin: 100rpx auto;
  height:90rpx;
  background:linear-gradient(-90deg,rgba(242,106,83,1) 0%,rgba(238,67,39,1) 100%);
  border-radius:45rpx;
  color: #FFFFFF;
  font-size: 34rpx;
}
</style>
