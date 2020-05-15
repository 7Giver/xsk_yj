<template>
  <view class="container">
    <view class="ul-section">
      <view v-for="(item, index) in orderList"  @click="_changeOrder(item.id)" :key="index" :class="{ active: item.id == orderId }">{{ item.text }}</view>
    </view>
    <view class="splitCls"></view>
    <!-- 列表 升序-->
    <view class="detai-list" v-if="orderId==1">
      <view class="item">
        <image class="img" src="https://cdn.swh296.com/img/common/missing-face.png" mode=""></image>
        <view class="item-r">
         <view class="cont">
           兰秀全实木子母床儿童高低上下床双人大 人母子两层上下铺木床双层
         </view>
         <view class="yj_money">
           <view class="num">
             <text class="num-l">108</text><text>营家币</text> 
           </view>
           <view class="market">
             市场参考价:120
           </view>
         </view>
        </view>
      </view>
    </view>
    <!-- 列表降序 -->
    <view class="detai-list"  v-if="orderId==2">
      <view class="item">
        <image class="img" src="https://cdn.swh296.com/img/common/missing-face.png" mode=""></image>
        <view class="item-r">
         <view class="cont">
           12321213 人母子两层上下铺木床双层
         </view>
         <view class="yj_money">
           <view class="num">
             <text class="num-l">108</text><text>营家币</text> 
           </view>
           <view class="market">
             市场参考价:120
           </view>
         </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderList: [
        {
          text: '营家币升序',
          id: 1
        },
        {
          text: '营家币降序',
          id: 2
        }
      ],
      orderId: 1
    };
  },
  methods: {
    _changeOrder(id) {
      console.log(id)
      this.orderId = id;
      console.log(this.orderId)
    }
  }
};
</script>

<style lang="scss">
@import 'mixin.scss';
.ul-section {
  width: 80%;
  margin: 0 10%;
  height: 100rpx;
  font-size: 30rpx;
  color: #666666;
  @include flexSA;
  > view {
    position: relative;
    line-height: 100rpx;
    @include active;
  }
}
.detai-list {
  width: 100%;
  background-color: #fff;
  .item {
    padding: 25rpx 0rpx;
    margin: 0 30rpx;
    // height: 120rpx;
    color: #333537;
    @include flexX;
    @include flexSB;
    &:last-child {
      border-bottom: none;
    }
    border-bottom: 1px solid #e8e8e8;
    &:first-child {
      border-bottom: 1px solid #e8e8e8;
    }
    .img{
      width:158rpx;
      height:158rpx;
      margin-right:20rpx;
      border-radius:6rpx
    }
    .item-r{
      flex:1;
      .cont{
        font-size:28rpx;
        color: #333537;
        @include  two_txt_cut;
      }
      .yj_money{
        margin-top: 15rpx;
       @include flexX;
       .num{
         margin-right:15rpx;
         @include flexX;
         @include flexJ;
         .num-l{
           color: #F64443;
           margin-top: 4rpx;
         }
       }
       .market{
         font-size:24rpx;
         color: #999;
       }
      }
    }
  }
}
</style>
