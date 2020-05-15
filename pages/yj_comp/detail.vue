<template>
  <view class="container">
    <!-- 头部 -->
    <view class="info_header">
      <view class="inner">
        <view class="yj_num">
          <p>2468</p>
          <text>当前营家币</text>
        </view>
        <view class="comp-section">
          <view class="item">
            <text class="item-num">1021</text>
            <text class="item-text">累计营家币</text>
          </view>
          <view class="item">
            <text class="item-num">369</text>
            <text class="item-text">累计消耗</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 列表 -->
    <view class="detai-list">
      <view class="item">
        <view class="item-l">
          <view class="item-l-n">
            <text>现金购买</text>
            <text class="num">＋10</text>
          </view>
          <view class="item-l-t">
              2020-03-01 13:35:34
          </view>
        </view>
        <view class="item-r">
          剩余:<text>1680</text>
        </view>
        
      </view>
      
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss">
@import 'mixin.scss';
.info_header {
  width: 100%;
  height: 345rpx;
  background-image: url('https://cdn.swh296.com/img/yj/yj_t_bg.png');
  background-size: 100% 100%;
  position: relative;
  .inner {
    width: 708rpx;
    height: 281rpx;
    position: absolute;
    left: 21rpx;
    bottom: 0;
    background-image: url('https://cdn.swh296.com/img/yj/yj_t_bg1.png');
    background-size: 100% 100%;
    @include flexY;
    .yj_num {
      margin-top: 56rpx;
      @include flexY;
      color: #fff;
      p {
        font-size: 50rpx;
        margin-bottom: 5rpx;
      }
      text {
        font-size: 26rpx;
      }
    }
    .comp-section {
      width: 70%;
      height: 120rpx;
      position: absolute;
      bottom: 0;
      left: 15%;
      color: #fff;
      @include flexSA;
      &::before {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 2rpx;
        height: 50%;
        background-color: #fff;
        color: #fff;
      }
      .item {
        @include flexY;
        @include flexJ;
        font-size: 26rpx;
        .item-num {
          font-size: 36rpx;
          margin-bottom: 6rpx;
        }
      }
    }
  }
}
.detai-list{
  width: 100%;
  .item{
    height: 120rpx;
    margin: 0 40rpx;
    padding: 30rpx auto 20rpx;
    color: #333537;
    @include flexX;
    @include flexSB;
    &:last-child{
      border-bottom:none;
    }
    border-bottom: 1px solid #E8E8E8;
    &:first-child{
      border-bottom: 1px solid #E8E8E8;
    }
    .item-l-n{
      @include flexX;
      font-size:30rpx;
      .num{
      }
    }
    .item-l-t{
      margin-top: 6rpx;
      font-size:22rpx;
      color:#999;
    }
  }
}
</style>
