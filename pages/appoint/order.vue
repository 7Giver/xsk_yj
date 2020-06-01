<template>
  <view class="container">
    <scroll-view scroll-y="true" v-if="goodsList.length>0" :style="{height:height}" lower-threshold=30  class="scroll-view" @scrolltolower="scrolltolower">
      <view class="order-section" >
        <view v-for="(item, index) in goodsList" :key="index" class="order-item" @click="navToDetailPage(item)">
          <view class="order-t">
            <text class="type">快递</text>
            <text class="state">已下单</text>
          </view>
          <view class="order-b">
            <view class="inner">
              <text>取件地址 :</text>
              <view class="content">
               小区北门风潮自提柜
              </view>
            </view>
            <view class="inner">
              <text>服务时间 :</text>
              <view class="content">
               5月27日   12:36
              </view>
            </view>
          </view>
        </view>
      </view>
      <uni-load-more v-if="loadmore" :status="loadingType"></uni-load-more>
    </scroll-view>
    <empty setSrc="https://cdn.swh296.com/img/common/empty_content.png" v-if="isLoaded === true && goodsList.length==0">
      <view class="empty-text">
        暂无订单
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
      cateList: [],
      goodsList: [],
      loading: true,
      page: 1,
      limit: 10,
      loadingType:'loading',
      loadmore:false,
      height:'',
      isLoaded:false,
      cat_id:''
    };
  },
  created(options) {
    let windowHeight = uni.getSystemInfoSync().windowHeight-50;
    this.height = windowHeight + 'px';
    this.getHomeRecommendProducts()
  },
  methods: {
    scrolltolower(e){
      if(this.loadingType == 'noMore'){
        return false
      }else{
        this.getHomeRecommendProducts()
      }
    },
    //精品推荐
    getHomeRecommendProducts() {
      this.$http
        .post(`/addons/xshop/product/getHomeRecommendProducts`, {
          page: this.page,
          sort: this.sort,
          order: this.order,
          type:'all'
        })
        .then(response => {
          const res = response.data;
          console.log('加载一次~')
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
<style lang="scss" scoped>
@import 'mixin.scss';
.container {
  background-color: #F7F9FB;
  .scroll-view {
    width: 100%;
  }
  .order-section{
    width: 668rpx;
    margin: 0 auto;
    margin-top: 30rpx;
    .order-item {
      width: 100%;
      border-radius:6rpx;
      background-color: #fff;
      margin-bottom: 20rpx;
      color: #282828;
      .order-t{
        margin:0 33rpx;
        height: 90rpx;
        @include flexSB;
        font-size: 32rpx;
        border-bottom: 1px solid #DFDFDF;
        .state{
          color: #FE8619;
        }
      }
      .order-b{
        margin:0 33rpx;
        padding: 20rpx 0 40rpx;
        font-size: 30rpx;
        .inner{
          margin-top: 20rpx;
          // @include flexX;
          display: flex;
          .content{
            margin-left: 20rpx;
            color: #666666;
            flex: 1;
          }
        }
      }
    }
  }
}
</style>
