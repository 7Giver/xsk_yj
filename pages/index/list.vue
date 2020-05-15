<template>
  <view class="content">
    <view class="navbar" :style="{ position: headerPosition, top: headerTop }">
      <view class="nav-item" :class="{ current: filterIndex === 0 }" @click="tabClick(0)">综合</view>
      <view class="nav-item" :class="{ current: filterIndex === 1 }" @click="tabClick(1)">
        <text>价格</text>
        <view class="p-box">
          <text :class="{ active: order === 'asc' && filterIndex === 1 }" class="yticon icon-shang"></text>
          <text :class="{ active: order === 'desc' && filterIndex === 1 }" class="yticon icon-shang xia"></text>
        </view>
      </view>
      <view class="nav-item" :class="{ current: filterIndex === 2 }" @click="tabClick(2)">销量</view>
      <view class="nav-item" :class="{ current: filterIndex === 3 }" @click="tabClick(3)">新品</view>
    </view>
    <scroll-view scroll-y="true" v-if="goodsList.length>0" enable-back-to-top="true" :style="{height:height}" class="scroll-view" @scrolltolower="getHomeRecommendProducts">
      <view class="pro-section" >
        <view v-for="(item, index) in goodsList" :key="index" class="guess-item" @click="navToDetailPage(item)">
          <view class="image-wrapper"><image :src="item.image" mode="aspectFill"></image></view>
          <text class="title">{{ item.title }}</text>
          <p class="price">¥{{ item.price }}</p>
          <view class="desc">
            <view v-for="(s, i) in item.service_tags" :key="i">{{ s }}</view>
          </view>
        </view>
      </view>
      <uni-load-more v-if="loadmore" :status="loadingType"></uni-load-more>
    </scroll-view>
    <empty setSrc="https://cdn.swh296.com/img/common/empty_content.png" v-if="isLoaded === true && goodsList.length==0">
      <view class="empty-text">
        暂无相关商品
      </view>
    </empty>
    <rf-loading v-if="loading"></rf-loading>
  </view>
</template>

<script>
import {mapState} from 'vuex'
import empty from "@/components/empty";
export default {
  components:{
    empty
  },
  data() {
    return {
      cateMaskState: 0, //分类面板展开状态
      headerPosition: 'fixed',
      headerTop: '0px',
      filterIndex: 0,
      cateId: 0, //已选三级分类id
      priceOrder: 0, //1 价格从低到高 2价格从高到低
      cateList: [],
      goodsList: [],
      loading: true,
      page: 1,
      limit: 10,
      sort: 'weigh', //排序字段:weigh=权重,price=价格,new=新品,sold_count=销量
      order: 'asc', //顺序:desc=逆序,asc=正序
      loadingType:'loading',
      loadmore:false,
      height:'500',
      isLoaded:false,
      cat_id:''
    };
  },
  onLoad(options) {
    this.cat_id = options.cat_id
    let windowHeight = uni.getSystemInfoSync().windowHeight;
    this.height = windowHeight + 'px';
    this.getHomeRecommendProducts()
  },
  methods: {
    //精品推荐
    getHomeRecommendProducts() {
      this.$http
        .post(`/addons/xshop/product/getHomeRecommendProducts`, {
          page: this.page,
          sort: this.sort,
          order: this.order,
          type:'all'
          // cat_id:this.cat_id,
        })
        .then(response => {
          const res = response.data;
          uni.hideLoading();
          this.loading = false;
          if (response.code === 1) {
            let data = res.data
            if(this.page == 1){
              if(data.length<this.limit){
                if(data.length ==0) {
                  this.loadmore = false
                }else{
                  this.loadmore = true
                }
                this.loadingType = 'noMore'
              }else{
                this.loadingType = 'more'
                this.loadmore = true
                this.page ++
              }
              this.goodsList = data
            }else {
              this.page ++
              if(data.length<this.limit){
                this.loadingType = 'noMore';
              }else{
                this.loadingType = 'more';
              }
              this.goodsList = this.goodsList.concat(data)
              this.loadmore = true
            }
            this.isLoaded = true
          }
        });
    },
    //筛选点击
    tabClick(index) {
      // if (this.filterIndex === index && index !== 1) {
      //   return;
      // }
      this.filterIndex = index;
      // sort:'weigh'  //排序字段:weigh=权重,price=价格,new=新品,sold_count=销量
      // order:'asc'   //顺序:desc=逆序,asc=正序
      if (index === 0) {
        this.sort = 'weigh';
        this.order = 'asc';
      } else if (index === 1) {
        this.sort = 'price';
        this.order = this.order === 'asc' ? 'desc' : 'asc';
      } else if (index === 2) {
        this.sort = 'sold_count';
        this.order = 'asc';
      } else if (index === 3) {
        this.sort = 'new';
        this.order = 'asc';
      }
      this.page = 1
      this.loadingType= 'loading'
      this.goodsList = []
      uni.showLoading({
        title: '正在加载'
      });
      this.getHomeRecommendProducts();
      uni.pageScrollTo({
        duration: 300,
        scrollTop: 0
      });
      // this.loadData('refresh', 1);
    },
    //详情
    navToDetailPage(item) {
      let id = item.id;
      uni.navigateTo({
        url: `/pages/product/product?id=${id}`
      });
    },
    stopPrevent() {}
  }
};
</script>
<style lang="scss">
page,
.content {
  background-color: #f8f8f8 !important;
}
</style>
<style lang="scss" scoped>
@import 'mixin.scss';
page,
.content {
  background-color: #f8f8f8 !important;
  // background: $page-color-base;
}
.content {
  // padding-top: 96rpx;
  padding-top: 80rpx;
}

.navbar {
  position: fixed;
  left: 0;
  top: var(--window-top);
  display: flex;
  width: 100%;
  height: 80rpx;
  background: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.06);
  z-index: 10;
  .nav-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 30rpx;
    color: $font-color-dark;
    position: relative;
    &.current {
      color: $base-color;
      &:after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 120rpx;
        height: 0;
        border-bottom: 4rpx solid $base-color;
      }
    }
  }
  .p-box {
    display: flex;
    flex-direction: column;
    .yticon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30rpx;
      height: 14rpx;
      line-height: 1;
      margin-left: 4rpx;
      font-size: 26rpx;
      color: #888;
      &.active {
        color: $base-color;
      }
    }
    .xia {
      transform: scaleY(-1);
    }
  }
  .cate-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 80rpx;
    position: relative;
    font-size: 44rpx;
    &:after {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      border-left: 1px solid #ddd;
      width: 0;
      height: 36rpx;
    }
  }
}
.scroll-view {
  width: 100%;
  height: 1000px;
  margin-top: 5rpx;
}
.pro-section {
  width: 700rpx;
  margin: 0 auto;
  border-radius: 15rpx 15rpx 0 0;
  background-color: #fff;
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx 30rpx 0;
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
    @include flexX;
    view {
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
/* 分类 */
.cate-mask {
  position: fixed;
  left: 0;
  top: var(--window-top);
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 95;
  transition: 0.3s;

  .cate-content {
    width: 630rpx;
    height: 100%;
    background: #fff;
    float: right;
    transform: translateX(100%);
    transition: 0.3s;
  }
  &.none {
    display: none;
  }
  &.show {
    background: rgba(0, 0, 0, 0.4);

    .cate-content {
      transform: translateX(0);
    }
  }
}
.cate-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  .cate-item {
    display: flex;
    align-items: center;
    height: 90rpx;
    padding-left: 30rpx;
    font-size: 28rpx;
    color: #555;
    position: relative;
  }
  .two {
    height: 64rpx;
    color: #303133;
    font-size: 30rpx;
    background: #f8f8f8;
  }
  .active {
    color: $base-color;
  }
}

/* 商品列表 */
.goods-list {
  display: flex;
  flex-wrap: wrap;
  padding: 0 30rpx;
  background: #fff;
  .goods-item {
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
    font-size: $font-lg;
    color: $font-color-dark;
    line-height: 80rpx;
  }
  .price-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 10rpx;
    font-size: 24rpx;
    color: $font-color-light;
  }
  .price {
    font-size: $font-lg;
    color: $uni-color-primary;
    line-height: 1;
    &:before {
      content: '￥';
      font-size: 26rpx;
    }
  }
}
</style>
