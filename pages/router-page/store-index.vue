<template>
  <view style="height: 100%;">
    <view class="header-section">
      <view class="search-box">
        <mSearch
          class="mSearch-input-box"
          :mode="2" button="inside"
          :placeholder="defaultKeyword || '请输入关键字'"
          @confirm="search" @search="search"
          v-model="keyword">
        </mSearch>
      </view>
      <!-- <view class="store" v-if="storeInfo.name"> -->
      <view class="store" v-if="storeInfo.attention && storeInfo.attention.length == 0 && storeInfo.id != userInfo.store_id">
        <view class="store-l">
          <image :src="storeInfo.log_image_text" mode=""></image>
          <view class="">{{ storeInfo.name }}</view>
        </view>
        <button type="primary" v-if="storeInfo.attention.length == 0 && storeInfo.id != userInfo.store_id" @click="_collectStore" :class="{ collectCls: isCollect }">
          {{ collectText }}
        </button>
      </view>
    </view>
    <swiper class="banner-section round-dot" :indicator-dots="true" interval="2000"
		 duration="500" autoplay="true">
      <swiper-item v-for="(item, index) in storeCover" :key="index" class="banner-item"><image :src="item.image_text" /></swiper-item>
    </swiper>
    <!-- <image class="banner" v-if="storeCover.length>0" :src="storeCover[0].image_text" mode=""></image> -->
    <view class="coupon-section" v-if="couponList.length > 0">
      <scroll-view scroll-x class="scroll-coupon">
        <view class="coupon-item" @click="_getCoupon(item, index)" v-for="(item, index) in couponList" :class="[item.receive_status == 0 ? 'no-get' : 'alr-get']" :key="index">
          <!-- <image class="coupon-get" v-if="item.receive_status == 1" src="https://cdn.swh296.com/img/store-info/get1.png" mode=""></image> -->
          <image class="coupon-bg" src="https://cdn.swh296.com/uploads/20200515/d24af0da33a68f2e170db3d70163a8dc.png" mode=""></image>
          <view class="coupon-l">
            <view class="price-inner">
              <text>￥</text>
              <text class="price">{{ item.money }}</text>
            </view>
            <view class="desc">{{ item.desc }}</view>
          </view>
          <view class="coupon-r">
            <view v-show="item.type != 3">满{{ item.order_min_amount }}-{{ item.money }}</view>
            <button type="default" class="cu-btn" v-if="item.receive_status==0">立即领券</button>
            <button type="default" class="cu-btn" v-else>已领取</button>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="service-section">
      <scroll-view scroll-x class="scroll-service">
        <view class="service-item" v-for="(item, index) in serviceList" @click="_gType(item)" :key="index"><image :src="item.thumb_image_text" mode=""></image></view>
      </scroll-view>
    </view>
    <view class="nav-section">
      <view class="cu-item"
      :class="index == TabCur ? 'active' : ''"
      v-for="(item, index) in category" :key="index" @tap="tabSelect"
      :data-type="item.type" :data-id="index">
        <text>{{ item.text }}</text>
      </view>
    </view>
    <view class="pro-section" v-if="goodsList.length > 0">
      <view v-for="(item, index) in goodsList" :key="index" class="guess-item" @click="navToDetailPage(item)">
        <view class="image-wrapper"><image :src="item.image[0]" mode="aspectFill"></image></view>
        <text class="title">{{ item.title }}</text>
        <p class="price">¥{{ item.price }}</p>
        <view class="desc">
          <view v-for="(s, i) in item.service_tags" :key="i">{{ s }}</view>
        </view>
      </view>
    </view>
    <empty
      v-if="isLoaded && goodsList.length == 0"
      position="relative"
      margin="20px auto"
      setSrc="https://cdn.swh296.com/img/common/empty_content.png">
      <view class="empty-text">暂无相关商品</view>
    </empty>
    <view class="more" v-if="goodsList.length>0" @click="_more">
      <text>查看全部</text>
      <text class="yticon icon-you"></text>
    </view>
    <rf-loading v-if="loading"></rf-loading>
  </view>
</template>

<script>
import { authSetting } from '../../common/js/commonInfo.js';
import { mapState, mapMutations } from 'vuex';
import empty from '@/components/empty';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import mSearch from '@/components/rf-search/rf-search';
let timer = null;
export default {
  components: {
    empty,
    uniLoadMore,
    mSearch
  },
  data() {
    return {
      defaultKeyword: '',
      keyword: '',
      list: [],
      loading: false,
      category: [
        {
          text: '商品',
          id: 2,
          type: 'all'
        },
        {
          text: '精选',
          id: 0,
          type: 'rec'
        },
        {
          text: '热销',
          id: 1,
          type: 'hot'
        },
        {
          text: '新品',
          id: 3,
          type: 'new'
        }
      ],
      isLoaded: false,
      TabCur: 0,
      scrollLeft: 0,
      goodsList: [],
      storeInfo: {
        log_image_text: '',
        name: ''
      },
      type: 'all',
      page: 1,
      limit: 10,
      collectText: '已收藏',
      isCollect: false,
      loadingType: 'loading',
      loadmore: false,
      isCanGetCoupon: false,
      couponId: '',
      couponList: [],
      serviceList: [],
      storeCover:[]
    };
  },
  computed: {
    ...mapState(['token', 'userInfo', 'storeId'])
  },
  onShow() {
    this.defaultKeyword = ''
  },
  created() {
    console.log('created')
  },
  mounted(options) {
    // this.setStoreId(15)
    this.xshop()
    this.getStoreInfo()
    this.storeCoupon()
    this.getHomeList()
    this.getStoreNav()
  },
  methods: {
    ...mapMutations({
      setStoreId: 'setStoreId'
    }),
    _more(){
      uni.navigateTo({
        url:`/pages/router-page/list?cat_id=${this.TabCur}&type=${this.type}`
      })
    },
    getStoreNav(){
      this.$http.post(`/api/store/store/nav`,{
        id:this.storeId
      }).then(response => {
        const data = response.data;
        if (response.code === 1) {
          console.log('data', data);
          this.storeCover = data.banner
        }
      });
    },
    xshop() {
      this.$http.post(`/addons/xshop/category/index`).then(response => {
        const data = response.data;
        if (response.code === 1) {
          console.log('data', data);
          this.serviceList = data;
        }
      });
    },
    _gType(item) {
      uni.navigateTo({
        url: `/pages/category/category_product?id=${item.id}`
      });
    },
    search() {
      uni.navigateTo({
        url: `/pages/router-page/search_index?keyword=${this.keyword}&id=${this.storeId}`
      });
    },
    navToLogin() {
      if (!this.userInfo.mobile) {
        uni.navigateTo({
          url: '/pages/login/login'
        });
        return false;
      } else {
        return true;
      }
    },
    _collectStore() {
      if (!this.navToLogin()) {
        this.navToLogin();
      } else {
        this.collectSwitch();
      }
    },
    tabSelect(e) {
      this.TabCur = e.currentTarget.dataset.id;
      this.cid = e.currentTarget.dataset.id;
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
      uni.showLoading({
        title: '加载中'
      });
      this.page = 1;
      this.type = e.currentTarget.dataset.type;
      this.isLoaded = false;
      this.loadmore = false;
      this.goodsList = [];
      this.getHomeList();
    },
    navToDetailPage(item) {
      let id = item.id;
      uni.navigateTo({
        url: `/pages/product/product?id=${id}`
      });
    },
    jump_detail(id) {
      uni.navigateTo({
        url: '../home/detail?id=' + id
      });
    },
    //   id 优惠券id
    storeCoupon() {
      this.$http
        .post(`/addons/xshopcoupon/coupon/storeCoupon`, {
          store_id: this.storeId,
          token: this.token || uni.getStorageSync('state_token')
        })
        .then(response => {
          const data = response.data;
          if (response.code == 1) {
            this.couponList = data;
          }
        });
    },
    _getCoupon(item, index) {
      if (!this.navToLogin()) {
        this.navToLogin();
      } else {
        if (item.receive_status == 0) {
          this.addCoupon(item, index);
        }else{
          this.$api.msg('您已领取该优惠券~')
        }
      }
    },
    addCoupon(item, index) {
      this.$http
        .post(`/addons/xshopcoupon/coupon/addCoupon`, {
          id: item.id,
          token: this.token
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            this.$api.msg('领取优惠券成功~');
            this.$set(this.couponList[index], 'receive_status', 1);
            this.$set(this.couponList[index], 'bgImg', 'https://cdn.swh296.com/img/store-info/couon1.png');
          } else {
            this.$api.msg(response.msg);
          }
        });
    },
    collectSwitch() {
      let status = this.collectText == '已收藏' ? 0 : 1;
      this.$http
        .post(`/api/store/collect/switch`, {
          store_id: this.storeId,
          token: this.token,
          status: status
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            this.collectText = this.collectText == '已收藏' ? '收藏店铺' : '已收藏';
            this.isCollect = this.collectText == '已收藏' ? true : false;
            this.$api.msg(response.msg);
          }
        });
    },
    getStoreInfo() {
      this.$http
        .post(`/api/store/store/info`, {
          id: this.storeId,
          token: this.token || uni.getStorageSync('state_token')
        })
        .then(response => {
          const data = response.data;
          uni.hideLoading();
          this.loading = false;
          if (response.code === 1) {
            this.loaded = true;
            this.storeInfo = data.store_info;
            uni.setNavigationBarTitle({
              title: data.store_info.name
            });
            if (data.store_info.attention.length > 0) {
              this.collectText = '已收藏';
              this.isCollect = true;
            } else {
              this.collectText = '收藏店铺';
              this.isCollect = false;
            }
          }
        });
    },
    getCategory() {
      this.$http
        .post(`/api/store/store/category`, {
          id: this.storeId
        })
        .then(response => {
          const data = response.data;
          uni.hideLoading();
          if (response.code === 1) {
          }
        });
    },
    getHomeList() {
      this.$http
        .post(`/api/store/product/getHomeList`, {
          id: this.storeId,
          page: this.page,
          type: this.type
        })
        .then(response => {
          const data = response.data.data;
          if (response.code == 1) {
            uni.hideLoading();
            if(data && data.length>6){
              this.goodsList = data.splice(0,6)
            }else{
              this.goodsList = data;
            }
            this.isLoaded = true;
          }
        })
    }
  }
};
</script>
<style lang="scss">
/deep/.empty-content {
  // top: 50% !important;
  position: relative;
  margin: 60rpx auto;
}
</style>
<style lang="scss" scoped>
@import 'mixin.scss';
@import '../../colorui/animation.css';
page,
.app-container {
  background-color: #fff !important;
}
/deep/.empty-content {
  // top: 50% !important;
  position: relative;
  margin: 60rpx auto;
}
.banner-section{
  width: 100%;
  height: 287rpx;
  margin-bottom: -8rpx;
  .banner-item{
    width: 100%;
    height: 287rpx;
    image{
      width: 100%;
      height: 287rpx;
    }
  }
}
// .banner{
//   width: 100%;
//   height: 287rpx;
//   margin-bottom: -8rpx;
// }
.store {
  width: 690rpx;
  margin: 20rpx auto 0;
  padding: 0 21rpx;
  @include flexSB;
  height: 114rpx;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(227, 226, 225, 1);
  border-radius: 14rpx;
  position: relative;
  .store-l {
    @include flexX;
    @include flexA;
    font-size: 28rpx;
    color: #333537;
    image {
      width: 120rpx;
      height: 60rpx;
      margin-right: 30rpx;
    }
  }
  button {
    margin: 0;
    height: 52rpx;
    line-height: 52rpx;
    background: linear-gradient(-90deg, rgba(238, 71, 44, 1), rgba(242, 106, 82, 1));
    border-radius: 26rpx;
    font-size: 28rpx;
    color: #fff;
    &.collectCls {
      background: #999;
    }
    // &::after{
    //   border: none;
    // }
  }
}
.header-section {
  width: 100%;
  padding: 20rpx 0;
  // height:260rpx;
  background: linear-gradient(0deg, rgba(255, 212, 195, 1), rgba(254, 201, 175, 1));
  @include flexY;
  @include flexJ;
  .search-box {
    width: 690rpx;
    height: 66rpx;
    margin: 0rpx auto;
  }
}
.service-section {
  width: 100%;
  height: 196rpx;
  background: rgba(245, 245, 245, 1);
  padding: 18rpx 0 18rpx 20rpx;
  .scroll-service {
    white-space: nowrap;
    height: 160rpx;
    .service-item {
      width: 160rpx;
      margin-left: 20rpx;
      height: 160rpx;
      display: inline-block;
      position: relative;
      image {
        width: 160rpx;
        height: 160rpx;
      }
      &:last-child {
        // margin-right: 24rpx;
      }
    }
  }
}
.coupon-section {
  width: 100%;
  height: 152rpx;
  background: rgba(252, 240, 224, 1);
  padding: 21rpx 0rpx 0;
  .scroll-coupon {
    // padding-top: 21rpx;
    white-space: nowrap;
    height: 109rpx;
    .coupon-item {  
      width: 254rpx;
      height: 109rpx;
      margin-left: 24rpx;
      display: inline-block;
      position: relative;
      color: #fff;
      // padding: 10rpx 20rpx;
      &:last-child {
        margin-right: 24rpx;
      }
      // &.no-get {
      //   color: #9f0f0f;
      //   .price-inner {
      //     color: #fffce6;
      //   }
      //   .cu-btn {
      //     color: #f13a3c;
      //   }
      //   &.coupon-b {
      //     color: rgba(249, 237, 221, 1);
      //   }
      // }
      // &.alr-get {
      //   color: #f3f3f3;
      //   .price-inner {
      //     color: #999999;
      //   }
      //   .cu-btn {
      //     color: #cdcdcd;
      //   }
      //   &.coupon-b {
      //     color: #eeeeee;
      //   }
      // }
      .coupon-bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
      .coupon-get {
        width: 92rpx;
        height: 81rpx;
        position: absolute;
        right: 5%;
        top: 2%;
        z-index: 9;
      }
       // price-inner  
      .coupon-l{
        width: 60%;
        float: left;
        @include flexY;
        @include flexA;
        position: relative;
        .price-inner {
          @include flexX;
          font-size: 30rpx;
          margin-right: 10rpx;
          .price {
            font-size: 60rpx;
          }
        }
        .desc{
          color: rgba(249, 237, 221, 1);
          font-size: 21rpx;
        }
      } 
      .coupon-r{
        float: right;
        height: 100%;
        width: 40%;
        @include flexY;
        @include flexJ;
        @include flexA;
        font-size: 22rpx;
        position: relative;
        view{
          color: #D38F60;
          font-size: 16rpx;
          margin-bottom: 6rpx;
        }
        .cu-btn {
          width:82rpx;
          height:26rpx;
          border-radius: 13rpx;
          font-size: 16rpx;
          color: #FFE4D2;
          background:rgba(243,89,79,1);
        }
      } 
    }
  }
}
.get_coupon_img {
  width: 150rpx;
  height: 150rpx;
  position: fixed;
  bottom: 25%;
  right: 5%;
  z-index: 5;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
}
.poscls {
  position: fixed;
  top: 0;
  left: 0;
}
.nav-section {
  padding: 20rpx 10% 0;
  height: 100rpx;
  position: relative;
  background-color: #fff;
  @include flexX;
  border-bottom: 1px solid #F5F5F5;
  box-sizing: content-box;
  .cu-item {
    flex: 1;
    height: 100rpx;
    display: inline-block;
    line-height: 100rpx;
    // margin: 0 10rpx;
    // padding: 0 20rpx;
    text-align: center;
    position: relative;
    &.active {
      @include active;
    }
  }
}
.pro-section {
  width: 700rpx;
  margin: 0 auto;
  border-radius: 15rpx 15rpx 0 0;
  background-color: #fff;
  display: flex;
  flex-wrap: wrap;
  padding: 50rpx 30rpx 0;
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
.more {
  width: 700rpx;
  height: 88rpx;
  background: rgba(239, 239, 241, 1);
  border-radius: 10rpx;
  margin: 20rpx auto 40rpx;
  font-size: 30rpx;
  color: #999999;
  @include flexX;
  @include flexJ;
  .icon-you {
    margin-top: 5rpx;
  }
}
// }
</style>
