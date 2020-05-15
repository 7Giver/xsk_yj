<template>
  <view class="container">
    <view v-if="stabId === 1">
      <view class="coupon-item" v-for="(item, index) in cardList" :key="index">
        <image :src="item.image" mode=""></image>
        <view class="center">
          <text>{{ item.text }}</text>
          <button type="default" @click="_createCoupon(item)">+新建优惠券</button>
        </view>
      </view>
    </view>
    <view v-if="stabId === 2" class="coupon-section">
      <scroll-view scroll-y  @scroll="scroll" :style="{height:height}" class="scroll-view" @scrolltolower="scrolltolower">
        <view class="self-coupon" v-for="(item, index) in couponList" @click="_gSelfCardDetail(item)" :key="index">
          <image :src="item.image" mode=""></image>
          <view class="num">
            <text class="num-l">{{item.desc}}
              <text class="cut" v-if="item.type !=4 && item.type !=3">(满{{item.order_min_amount}}减{{item.money}})</text>
              <text class="cut" v-if="item.type==3">{{item.money}}单品券</text>
            </text>
            <text class="num-r">数量: {{item.count}}</text>
          </view>
          <view class="detail">
            <view class="detail-l">
              <text>{{item.name}}</text>
              <text class="time">有效期: {{item.use_start_time_text}} 至 {{item.use_end_time_text}}</text>
            </view>
            <view class="detail-r">
              <text>查看详情</text>
              <text class="cuIcon-roundright"></text>
            </view>
          </view>
        </view>
        <uni-load-more v-if="loadmore" :status="loadingType"></uni-load-more>
      </scroll-view>
    </view>
    <empty setSrc="https://cdn.swh296.com/img/common/empty_coupon.png" v-if="stabId === 2 &&  loaded === true && couponList.length === 0">
      <view class="empty-text">
        无相关内容
      </view>
    </empty>
    <view class="s-tab">
      <view class="item" v-for="(item, index) in sTab" :class="{ active: item.id == stabId }" @click="_switchTab(item)" :key="index">{{ item.text }}</view>
    </view>
  </view>
</template>

<script>
import empty from '@/components/empty';
import {mapState} from 'vuex'  
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
  components:{
    empty,
    uniLoadMore
  },
  data() {
    return {
      cardList: [
        {
          image: 'http://cdn.swh296.com/img/store-manage/coupon_cut.png',
          text: '满减优惠券'
        },
        {
          image: 'http://cdn.swh296.com/img/store-manage/coupon_youhui.png',
          text: '商品优惠券'
        },
        {
          image: 'http://cdn.swh296.com/img/store-manage/coupon_store.png',
          text: '商铺优惠券'
        }
      ],
      couponList:[],
      sTab: [
        {
          text: '首页',
          id: 1,
          title: '店铺卡券'
        },
        {
          text: '我的',
          id: 2,
          title: '我的卡券'
        }
      ],
      stabId: 1,
      page:1,
      loaded:false,
      loadingType:'loading',
      loadmore:false,
      height:'800',
      limit:10
    };
  },
  computed:{
    ...mapState(['token'])
  },
  onLoad() {
    let windowHeight = uni.getSystemInfoSync().windowHeight
    this.height = windowHeight - 80 +'px'
  },
  methods: {
    scroll(e){
      
    },
    _createCoupon(item) {
      switch (item.text) {
        case '满减优惠券':
          uni.navigateTo({
            url: '/pages/store_manage_comp/coupon_create_cut'
          });
          break;
        case '商品优惠券':
          uni.navigateTo({
            url: '/pages/store_manage_comp/coupon_create_goods'
          });
          break;
        case '商铺优惠券':
          uni.navigateTo({
            url: '/pages/store_manage_comp/coupon_create_store'
          });
          break;
        default:
          break;
      }
    },
    scrolltolower(){
      this.selfcouponList()
    },
    selfcouponList(){
      this.$http
        .post(`/api/merchants/coupon/index`, {
          token: this.token,
          page:this.page
        })
        .then(response => {
          const resData = response.data;
          if (response.code === 1) {
            console.log('data', data);
            let data = resData.data
            data.forEach(v=>{
              if(v.type==3){
                v.image = 'http://cdn.swh296.com/img/store-manage/coupon_youhui.png'
              }else if (v.type==4){
                v.image = 'http://cdn.swh296.com/img/store-manage/coupon_store.png'
              }else{
                v.image = 'http://cdn.swh296.com/img/store-manage/coupon_cut.png'
              }
            })
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
              this.couponList = data
            }else {
              this.page ++
              if(data.length<this.limit){
                this.loadingType = 'noMore';
              }else{
                this.loadingType = 'more';
              }
              this.couponList = this.couponList.concat(data)
              this.loadmore = true
            }
            this.loaded = true
            // data.forEach(v=>{
            //   if(v.type==3){
            //     v.image = 'http://cdn.swh296.com/img/store-manage/coupon_youhui.png'
            //   }else if (v.type==4){
            //     v.image = 'http://cdn.swh296.com/img/store-manage/coupon_store.png'
            //   }else{
            //     v.image = 'http://cdn.swh296.com/img/store-manage/coupon_cut.png'
            //   }
            // })
            // this.couponList = data
          }
        });
    },
    _gSelfCardDetail(item) {
      uni.navigateTo({
        url: `/pages/store_manage_comp/self_card_detail?id=${item.id}`
      });
    },
    _switchTab(item) {
      if(item.id == this.stabId) return
      this.stabId = item.id;
      uni.setNavigationBarTitle({
        title: item.title
      });
      if(item.id ==2){
        this.selfcouponList()
      }
    }
  }
};
</script>
<style lang="scss">
page,
.container {
  height: 100%;
}
</style>
<style lang="scss" scoped>
@import 'mixin.scss';
page,
.container {
  background-color: #f5f5f5;
  height: 100%;
}
.container {
  width: 100%;
  padding-top: 40rpx;
  .coupon-section{
    padding-bottom: 80rpx;
  }
  .scroll-view{
    width:100%;
    height: calc(100% - 55px);
  }
  .coupon-item,
  .self-coupon {
    width: 648rpx;
    height: 333rpx;
    margin: 0 auto -30rpx;
    position: relative;
    overflow: hidden;
    image {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .self-coupon {
    color: #fff;
    .num {
      width: 90%;
      margin: 50rpx auto;
      position: relative;
      @include flexSB;
      .num-l {
        font-size: 40rpx;
        .cut{
          font-size: 24rpx;
        }
      }
      .num-r {
        font-size: 28rpx;
      }
    }
    .detail {
      width: 90%;
      margin: 60rpx auto 0;
      position: relative;
      @include flexSB;
      .detail-l {
        font-size: 34rpx;
        @include flexY;
        .time {
          margin-top: 10rpx;
          font-size: 20rpx;
        }
      }
      .detail-r {
        @include flexX;
        font-size: 22rpx;
        text {
          margin-right: 10rpx;
        }
        .cuIcon-roundright {
          margin-top: 3rpx;
        }
      }
    }
  }

  .coupon-item {
    .center {
      width: 90%;
      margin: 18% 5% 0;
      position: relative;
      @include flexSB;
      text {
        font-size: 40rpx;
        color: #fff;
      }
      button {
        width: 201rpx;
        height: 54rpx;
        line-height: 54rpx;
        margin: 0;
        background: rgba(204, 204, 204, 0);
        border: 2px solid rgba(255, 255, 255, 1);
        border-radius: 27rpx;
        font-size: 26rpx;
        color: #fff;
      }
    }
  }
  .s-tab {
    width: 100%;
    height: 110rpx;
    font-size: 34rpx;
    color: #bababa;
    background: #fff;
    @include flexSB;
    position: fixed;
    bottom: 0;
    left: 0;
    &::before {
      content: '';
      width: 1px;
      height: 100%;
      position: absolute;
      left: 50%;
      margin-left: -1px;
      background-color: #efefef;
    }
    .item {
      flex: 1;
      height: 110rpx;
      line-height: 110rpx;
      text-align: center;
      &.active {
        color: #f1644c;
      }
    }
  }
}
</style>
