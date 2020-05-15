<template>
  <view style="height: 100%;">
    <view class="header">
      <view class="search-box">
        <!-- mSearch组件 如果使用原样式，删除组件元素  @confirm="doSearch"-->
        <mSearch class="mSearch-input-box" :mode="2" button="inside" :placeholder="defaultKeyword || '请输入关键字'" @search="doSearch" v-model="keyword"></mSearch>
      </view>
      <view class="nav-section">
        <scroll-view scroll-x class="nav" scroll-with-animation :scroll-left="scrollLeft">
          <view class="cu-item" v-for="(item, index) in productList[3]" :class="item.target == TabCur ? 'active' : ''"   :key="index" @tap="tabSelect" :data-id="item.target">
            <text>
              {{ item.title }}
            </text>
          </view>
        </scroll-view>
        <view class="tab_more">
          <image src="http://cdn.swh296.com/img/iconList/tab_more.png" mode=""></image>
        </view>
      </view>
      <!-- 轮播图 -->
  <!--  :indicator-color="bannerDotColor"
        :indicator-dots="true"
      :indicator-active-color="bannerDotActiveColor" -->
      <swiper
        class="screen-swiper"
        :class="dotStyle ? 'square-dot' : 'round-dot'"
        :circular="true"
        :autoplay="true"
        interval="5000"
        duration="500"
       
      >
        <swiper-item v-for="(item, index) in productList[0]" :key="index">
          <image :src="item.image" mode="aspectFill"></image>
          <!-- <video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover" v-if="item.type == 'video'"></video> -->
        </swiper-item>
      </swiper>
    </view>
    <!--  -->
    <view class="type-section">
      <view v-for="(item,index) in productList[1]" :key="index">
        <image :src="item.image" mode=""></image>
        <text>{{item.title}}</text>
      </view>
    </view>
    <!--  -->
    <view class="list">
      <image src="http://cdn.swh296.com/img/index/index_recommend.png" class="recommend" mode=""></image>
      <view class="pro-section">
        <view v-for="(item, index) in goodsList" :key="index" class="guess-item" @click="navToDetailPage(item)">
          <view class="image-wrapper"><image :src="item.image[0]" mode="aspectFill"></image></view>
          <text class="title">{{ item.title }}</text>
          <p class="price">
            ¥{{ item.price }}
          </p>
        <!--  <view class="desc">
            <view>满88包邮</view>
            <view>新品</view>
          </view> -->
        </view>
      </view>
    </view>
    <navigator url="/pages/router-page/indexAll">
    <view class="more">
      <text>查看全部</text>
      <text class="yticon icon-you"></text>
    </view>
    </navigator>
    <rf-loading v-if="loading"></rf-loading>
  </view>
</template>

<script>
import mSearch from '@/components/rf-search/rf-search';
export default {
  components: {
    mSearch
  },
  data() {
    return {
      defaultKeyword: '',
      keyword: '',
      oldKeywordList: [],
      hotKeywordList: [],
      keywordList: [],
      forbid: '',
      isShowKeywordList: false,
      //
      cardCur: 0,
      dotStyle: false,
      towerStart: 0,
      direction: '',
      TabCur: 0,
      scrollLeft: 0,
      goodsList: [],
      productList:[],
      loading:true,
      limit:10,
      page:1
    };
  },
  methods: {
    tabSelect(e) {
      this.TabCur = e.currentTarget.dataset.id;
      this.cid = e.currentTarget.dataset.id;
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
      this.page = 1;
      uni.showLoading({
        title: '加载中...'
      });
      this.getHomeRecommendProducts(this.TabCur)
    },
    navToDetailPage(item){
    	//测试数据没有写id，用title代替
    	let id = item.id;
    	uni.navigateTo({
    		url: `/pages/product/product?id=${id}`
    	})
    },
    // _gIndexAll(){
    //   uni.navigateTo({
    //     url:`/pages/router-page/indexAll?`
    //   })
    // },
    doSearch() {
      console.log(this.keyword);
      uni.navigateTo({
        url:`/pages/router-page/search?keyword=${this.keyword}`
      })
    },
    jump_detail(id) {
      uni.navigateTo({
        url: '../home/detail?id=' + id
      });
    },
    allType(){
      this.$http
        .post(`/addons/xshop/nav/allType`)
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            this.loading = false
            this.productList = data
            this.TabCur = this.productList[3][0].target
            this.getHomeRecommendProducts(this.TabCur)
          }
        });
    },
    //精品推荐
    getHomeRecommendProducts(cat_id){
      this.$http
        .post(`/addons/xshop/product/getHomeRecommendProducts`,{
          page:this.page,
          limit:this.limit,
          cat_id:cat_id
        })
        .then(response => {
          const data = response.data;
          uni.hideLoading()
          if (response.code === 1) {
            data && (this.goodsList = data.data)
          }
        });
    },
  },
  mounted() {
    console.log('mounted');
    this.allType()
  }
};
</script>

<style lang="scss" scoped>
@import  'mixin.scss';
page,.app-container{
  background-color: #F6F6F6;
}
.header {
  width: 100%;
  height: 421rpx;
  padding-top: 40rpx;
  background-image: url('http://cdn.swh296.com/img/index/index_head_bg.png');
  background-size: 100% 100%;
  background-position: bottom left;
  // overflow: hidden;
}
.search-box{
  width:690rpx;
  height:66rpx;
  margin: 0rpx auto 20rpx;
}
.nav-section{
  width: 100%;
  height: 100rpx;
  position: relative;
  .tab_more{
    width:100rpx;
    height:100rpx;
    background:linear-gradient(-90deg,rgba(255,255,255,0.99) 0%,rgba(255,255,255,0.88) 45%,rgba(255,255,255,0.3) 100%);
    position: absolute;
    right: 0;
    top:0;
    image{
      position: absolute;
      right:20rpx;
      top:39rpx;
      width: 28rpx;
      height: 22rpx;
    }
  }
}
.nav {
  padding-right: 100rpx;
  background-color: #fff;
  height: 100rpx;
  white-space: nowrap;
  position: relative;
}


::-webkit-scrollbar {
  display: none;
}
.nav .cu-item {
  height: 100rpx;
  display: inline-block;
  line-height: 100rpx;
  margin: 0 10rpx;
  padding: 0 20rpx;
  position: relative;
  &.active{
    @include active
  }
}
swiper{
  height: 190rpx;
}
.screen-swiper{
  width: 700rpx;
  min-height: 190rpx;
  margin: 22rpx auto ;
}
.type-section{
  width:700rpx;
  margin: 40rpx auto 20rpx;
  height:168rpx;
  background:rgba(255,255,255,1);
  border-radius:14rpx;
  @include flexSB;
  >view{
    flex: 1;
    @include flexY;
    @include flexA;
    @include flexJ;
    text{
      width: 100%;
      text-align: center;
      color: #666666;
      font-size:24rpx;
      margin-top: 22rpx;
    }
    image{
      width: 66rpx;
      height: 66rpx;
    }
  }
}
.list{
  width:700rpx;
  margin: 0 auto;
  border-radius: 15rpx 15rpx 0 0;
  background-color: #fff;
  .recommend{
    width: 100%;
    height: 121rpx;
  }
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
  .more{
    width: 700rpx;
    height:88rpx;
    background:rgba(239,239,241,1);
    border-radius:10rpx;
    margin: 20rpx auto 40rpx;
    font-size:30rpx;
    color: #999999;
    @include flexX;
    @include flexJ;
    .icon-you{
      margin-top: 5rpx;
    }
  }
</style>
