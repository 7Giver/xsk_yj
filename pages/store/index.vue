<template>
  <view style="height: 100%;">
    <view class="header">
      <view class="store">
        <view class="store-l">
          <image src="../../static/emptyCart.jpg" mode=""></image>
          <view class="">
            这是一个官方旗舰店
          </view>
        </view>
        <button type="primary" @click="_gStore">收藏店铺</button>
      </view>
    </view>
    <view class="nav-section">
        <view class="cu-item" :class="index == TabCur ? 'active' : ''" v-for="(item, index) in category" :key="index" @tap="tabSelect" :data-id="index">
          <text>
            {{ item.text }}
          </text>
        </view>
    </view>
    <!--  -->
    <view class="list">
      <view class="pro-section">
        <view v-for="(item, index) in goodsList" :key="index" class="guess-item" @click="navToDetailPage(item)">
          <view class="image-wrapper"><image :src="item.image" mode="aspectFill"></image></view>
          <text class="title">{{ item.title }}</text>
          <p class="price">
            ¥{{ item.price }}
          </p>
          <view class="desc">
            <view>满88包邮</view>
            <view>新品</view>
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
      list: [],
      category: [
        {
          text:'精选',
          id:0
        },
        {
          text:'热销',
          id:1
        },
        {
          text:'商品',
          id:2
        },
        {
          text:'新品',
          id:3
        }
      ],
      TabCur: 0,
      scrollLeft: 0,
      goodsList: [],
    };
  },
  methods: {
    tabSelect(e) {
      this.TabCur = e.currentTarget.dataset.id;
      this.cid = e.currentTarget.dataset.id;
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
      this.page = 1;
      this.min_id = 1;
    },
    navToDetailPage(item){
    	//测试数据没有写id，用title代替
    	let id = item.title;
    	uni.navigateTo({
    		url: `/pages/product/product?id=${id}`
    	})
    },
    jump_detail(id) {
      uni.navigateTo({
        url: '../home/detail?id=' + id
      });
    }
  },
  onLoad() {
    
  },
  async mounted() {
    console.log('mounted');
    let goodsList = await this.$api.json('goodsList');
    this.goodsList = goodsList || [];
  }
};
</script>

<style lang="scss">
@import  'mixin.scss';
page,.app-container{
  background-color: #fff !important;
}
.header {
  width: 100%;
  height: 340rpx;
  padding-top: 40rpx;
  background-image: url('http://cdn.swh296.com/img/index/index_head_bg.png');
  background-size: 100% 100%;
  background-position: bottom left;
  // overflow: hidden;
  .store{
    width:690rpx;
    margin: 21rpx auto;
    padding: 0 21rpx;
    @include flexSB;
    height:130rpx;
    background:rgba(255,255,255,1);
    border:1px solid rgba(227, 226, 225, 1);
    border-radius:14rpx;
    .store-l{
      @include flexX;
      @include flexA;
      font-size: 28rpx;
      color: #333537;
      image{
        width: 120rpx;
        height: 60rpx;
        margin-right: 30rpx;
      }
    }
    button{
      margin: 0;
      height:52rpx;
      line-height: 52rpx;
      background:linear-gradient(-90deg,rgba(238,71,44,1),rgba(242,106,82,1));
      border-radius:26rpx;
      font-size:28rpx;
      color: #fff;
      // &::after{
      //   border: none;
      // }
    }
  }
}
.nav-section{
  padding: 0 10%;
  height: 100rpx;
  position: relative;
  background-color: #fff;
  @include flexX;
  border-bottom: 1px solid #F5F5F5;
  .cu-item {
    flex:1;
    height: 100rpx;
    display: inline-block;
    line-height: 100rpx;
    // margin: 0 10rpx;
    // padding: 0 20rpx;
    text-align: center;
    position: relative;
    &.active{
      @include active
    }
  }
}
.list{
  width:700rpx;
  margin: 0 auto;
  border-radius: 15rpx 15rpx 0 0;
  background-color: #fff;
  .pro-section {
    display: flex;
    flex-wrap: wrap;
    padding: 10rpx 30rpx 0;
    background: #fff;
    .guess-item {
      display: flex;
      flex-direction: column;
      width: 48%;
      padding-bottom: 40rpx;
      &:nth-child(2n + 1) {
        margin-right: 4%;
      }
    }
    .image-wrapper {
      width: 100%;
      height: 330rpx;
      border-radius: 3px;
      overflow: hidden;
      image {
        width: 100%;
        height: 100%;
        opacity: 1;
      }
    }
    .title {
      margin-top: 18rpx;
      height: 90rpx;
      line-height: 45rpx;
      font-size: $font-lg;
      color: #333537;
      // line-height: 80rpx;
      @include two_txt_cut;
    }
    .price {
      font-size: 34rpx;
      color: #f64443;
      line-height: 1;
      text {
        margin-left: 5rpx;
        font-size: 24rpx;
      }
    }
    .desc {
      margin-top: 8rpx;
      @include flexX view {
        width: max-content;
        margin-right: 20rpx;
        font-size: 20rpx;
        padding: 2rpx 5rpx;
        background: rgba(9, 111, 208, 0);
        color: rgba(246, 68, 67, 1);
        border: 1px solid rgba(246, 68, 67, 1);
        border-radius: 15rpx;
      }
    }
  }
}
</style>
