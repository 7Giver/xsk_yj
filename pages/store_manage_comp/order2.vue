<template>
  <view class="content">
    <!-- <view class="navbar"> -->
    <scroll-view class="navbar" :scroll-left="scrollBar" scroll-with-animation scroll-x="true">
      <view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex === index }" @click="tabClick(index)">{{ item.text }}</view>
    </scroll-view>
    <!-- </view> -->

    <swiper :current="tabCurrentIndex" class="swiper-box" :style="{height:height}" duration="300" @change="changeTab">
      <swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
        <scroll-view class="list-scroll-content" scroll-y @scrolltolower="getOrder">
          <!-- 空白页 -->
          <empty setSrc="https://cdn.swh296.com/img/common/empty_content.png" v-if="tabItem.loaded === true && tabItem.orderList.length === 0">
            <view class="empty-text">
              无相关内容
            </view>
          </empty>
          <view v-for="(item, index) in tabItem.orderList" :key="index" class="order-item" @click="_toSelfOrderDetail(item)">
            <view class="i-top b-b">
              <text class="store-name">{{ item.create_time_text }}</text>
              <text class="state" :style="{ color: item.stateTipColor }">{{ item.stateTip }}</text>
              <text v-if="item.state === 9" class="del-btn yticon icon-iconfontshanchu1" @click="deleteOrder(index)"></text>
            </view>
            <scroll-view v-if="item.products.length > 1" class="goods-box" scroll-x>
              <view v-for="(goodsItem, goodsIndex) in item.products" :key="goodsIndex" class="goods-item">
                <image class="goods-img" :src="goodsItem.images_text[0]" mode="aspectFill"></image>
              </view>
            </scroll-view>
            <view v-if="item.products.length === 1" class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.products" :key="goodsIndex">
              <view class="t-cont">
                <image class="goods-img" :src="goodsItem.images_text[0]" mode="aspectFill"></image>
                <view class="center">
                  <text class="title clamp">{{ goodsItem.title }}</text>
                  <text class="attr-box">规格:{{ goodsItem.attributes }}</text>
                </view>
           <!--     <view class="right">
                  <text class="price">{{ item.pay_price }}</text>
                  <text class="num">x{{ goodsItem.quantity }}</text>
                </view> -->
              </view>
            </view>
            <view class="action-box">
              <view class="total-num">
                <text class="num-l">合计:<text>￥ {{ item.products_price }}</text></text>
                <!-- <text class="num-freight">包含运费: 0.00</text> -->
              </view>
            </view>
          </view>
          <uni-load-more v-if="tabItem.loaded === true && tabItem.orderList.length === 0 && page !=1" :status="tabItem.loadingType"></uni-load-more>
        </scroll-view>
      </swiper-item>
    </swiper>
    <!-- <rf-loading v-if="loading"></rf-loading> -->
  </view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from '@/components/empty';
import Json from '@/Json';
import {mapState} from 'vuex';
export default {
  components: {
    uniLoadMore,
    empty
  },
  data() {
    return {
      loading:false,
      tabCurrentIndex: 0,
      orderData:[],
      navList: [
        {
          state: 0,
          text: '全部',
          loadingType: 'loading',
          orderList: [],
          page:1
        },
        {
          state: 1,
          text: '待发货',
          loadingType: 'loading',
          orderList: [],
          page:1
        },
        {
          state: 2,
          text: '待确认',
          loadingType: 'loading',
          orderList: [],
          page:1
        },
        {
          state: 3,
          text: '售后/退款',
          loadingType: 'more',
          // isSale:true,
          orderList: [],
          page:1
        }
      ],
      scrollBar:0,
      height:'',
      page:1,
      limit:5
    };
  },
  computed:{
    ...mapState(['token'])
  },
  onLoad(options) {
    // this.loadData();
  },
  created() {
    this.height = uni.getSystemInfoSync().windowHeight - 90 +'px'
    this.tabCurrentIndex = 0
    // this.loadData();
    this.getOrder()
  },
  methods: {
    _toSelfOrderDetail(item){
      console.log(item)
      uni.navigateTo({
        url:`/pages/store_manage_comp/order_detail?id=${item.id}`
      })
    },
    getOrder(source){
      let navItem = this.navList[this.tabCurrentIndex];
      let state = navItem.state;
      if (source === 'tabChange' && navItem.loaded === true) {
        //tab切换只有第一次需要加载数据
        return;
      }
      console.log(this.tabCurrentIndex,navItem,navItem.loadingType)
      // if (navItem.loadingType === 'loading') {
      //   //防止重复加载
      //   return;
      // }
      navItem.loadingType = 'loading';
      this.$http
        .post(`/api/merchants/Order/index`,{
          token:this.token,
          type:this.tabCurrentIndex,
          page:this.page || 1
          // limit:this.limit
        })
        .then(response => {
          const data = response.data;
          uni.hideLoading()
          this.loading = false
          if (response.code === 1) {
            let resultData = data.data
            this.orderData =resultData
           console.log('data',data.data)
           if(resultData.length === 0){
             
           }
           if(resultData.length<this.limit){
             navItem.loadingType = 'noMore';
             console.log('nomore',navItem,navItem.loadingType)
           }else{
             // this.page++
             navItem.page ++
             navItem.loadingType = 'more';
           }
           if(this.page === 1){
             navItem.orderList = resultData
           }else{
             navItem.orderList = navItem.orderList.concat(resultData)
             console.log(navItem.orderList)
           }
           this.$set(navItem, 'loaded', true);
           //判断是否还有数据， 有改为 more， 没有改为noMore
          }
        });
    },
    //swiper 切换
    changeTab(e) {
      this.tabCurrentIndex = e.target.current;
      // this.page = 1
      this.getOrder('tabChange');
      // if(this.tabCurrentIndex <3){
      //   this.scrollBar = 0
      // }else{
      //   this.scrollBar = this.tabCurrentIndex * 100
      // }
    },
    //顶部tab点击
    tabClick(index) {
      this.page = 1
      this.tabCurrentIndex = index;
      uni.pageScrollTo({
        scrollTop: 0,
        duration:300
      })
      for (let i = 0; i < this.navList.length; i++) {
          this.navList[i].orderList =[]
      }
      this.getOrder();
    },
    //删除订单
    deleteOrder(index) {
      uni.showLoading({
        title: '请稍后'
      });
      setTimeout(() => {
        this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
        uni.hideLoading();
      }, 600);
    },
    //取消订单
    cancelOrder(item) {
      uni.showLoading({
        title: '请稍后'
      });
      setTimeout(() => {
        let { stateTip, stateTipColor } = this.orderStateExp(9);
        item = Object.assign(item, {
          state: 9,
          stateTip,
          stateTipColor
        });

        //取消订单后删除待付款中该项
        let list = this.navList[1].orderList;
        let index = list.findIndex(val => val.id === item.id);
        index !== -1 && list.splice(index, 1);

        uni.hideLoading();
      }, 600);
    },

    //订单状态文字和颜色
    orderStateExp(state) {
      let stateTip = '',
        stateTipColor = '#fa436a';
      switch (+state) {
        case 1:
          stateTip = '待付款';
          break;
        case 2:
          stateTip = '待发货';
          break;
        case 9:
          stateTip = '订单已关闭';
          stateTipColor = '#909399';
          break;

        //更多自定义
      }
      return { stateTip, stateTipColor };
    }
  }
};
</script>

<style lang="scss">
@import 'mixin.scss';
page,
.content {
  background: $page-color-base;
  height: 100%;
}

.swiper-box {
  height: calc(100% - 40px);
}
.list-scroll-content {
  height: 100%;
}

.navbar {
  // display: flex;
  height: 40px;
  padding: 0 50rpx;
  background: #fff;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 10;
  white-space: nowrap;
  .nav-item {
    display: inline-block;
    padding: 0 40rpx;
    text-align: center;
    // flex: 1;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    height: 100%;
    line-height: 40px;
    font-size: 15px;
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
        width: 30px;
        height: 0;
        border-bottom: 2px solid $base-color;
      }
    }
  }
}

.uni-swiper-item {
  height: auto;
}
.order-item {
  display: flex;
  flex-direction: column;
  padding-left: 30rpx;
  background: #fff;
  margin-top: 16rpx;
  .i-top {
    display: flex;
    align-items: center;
    height: 80rpx;
    padding-right: 30rpx;
    font-size: $font-base;
    color: $font-color-dark;
    position: relative;
    .store-name {
      color: #333537;
      font-size: 28rpx;
      flex: 1;
    }
    .state {
      color: $base-color;
    }
    .del-btn {
      padding: 10rpx 0 10rpx 36rpx;
      font-size: $font-lg;
      color: $font-color-light;
      position: relative;
      &:after {
        content: '';
        width: 0;
        height: 30rpx;
        border-left: 1px solid $border-color-dark;
        position: absolute;
        left: 20rpx;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  /* 多条商品 */
  .goods-box {
    height: 160rpx;
    padding: 20rpx 0;
    white-space: nowrap;
    .goods-item {
      width: 120rpx;
      height: 120rpx;
      display: inline-block;
      margin-right: 24rpx;
    }
    .goods-img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  /* 单条商品 */
  .goods-box-single {
    padding-top: 20rpx;
    .t-cont {
      display: flex;
      padding-bottom: 25rpx;
      border-bottom: 1px solid #e8e8e8;
    }
    .goods-img {
      display: block;
      width: 120rpx;
      height: 120rpx;
    }
    .center {
      flex: 1;
      margin: 0 20rpx;
      overflow: hidden;
      @include flexY;
      @include flexJ;
      .title {
        font-size: $font-base + 2rpx;
        color: $font-color-dark;
        line-height: 1.2;
      }
      .attr-box {
        font-size: $font-sm + 2rpx;
        color: $font-color-light;
        padding: 10rpx 0rpx;
      }
    }
    .right {
      @include flexY;
      @include flexJ;
      justify-content: center;
      padding: 0 30rpx 0 0rpx;
      overflow: hidden;
      .price {
        font-size: $font-base + 2rpx;
        color: $font-color-dark;
        &:before {
          content: '￥';
          font-size: $font-sm;
          margin: 0 2rpx 0 8rpx;
        }
      }
      .num {
        text-align: right;
      }
    }
  }

  .price-box {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    padding: 20rpx 30rpx;
    font-size: $font-sm + 2rpx;
    color: $font-color-light;
    .num {
      margin: 0 8rpx;
      color: $font-color-dark;
    }
    .price {
      font-size: $font-lg;
      color: $font-color-dark;
      &:before {
        content: '￥';
        font-size: $font-sm;
        margin: 0 2rpx 0 8rpx;
      }
    }
  }
  .action-box {
    // @include flexSB;
    height: 100rpx;
    position: relative;
    padding-right: 30rpx;
    .total-num {
      float: right;
      height: 100%;
      @include flexX;
      .num-l {
        color: #333537;
        font-size: 28rpx;
        margin-right: 14rpx;
        text{
          color: #F64443;
        }
      }
      .num-freight {
        color: #999999;
        font-size: 24rpx;
      }
    }
    .button-cont {
      float: right;
      margin-top: 22rpx;
      .action-btn {
        width: 136rpx;
        height: 56rpx;
        margin: 0;
        margin-left: 24rpx;
        padding: 0;
        text-align: center;
        line-height: 56rpx;
        font-size: $font-sm + 2rpx;
        border-radius: 14rpx;
        // 提醒发货 确认收货 去付款
        &.fahuo {
          background: linear-gradient(-90deg, rgba(242, 106, 83, 1) 0%, rgba(238, 67, 39, 1) 100%);
          color: #fff;
        }
        &.look {
          background: linear-gradient(-90deg, rgba(242, 106, 83, 1) 0%, rgba(238, 67, 39, 1) 100%);
          color: #f0573d;
        }
      }
    }
  }
}

/* load-more */
.uni-load-more {
  display: flex;
  flex-direction: row;
  height: 80rpx;
  align-items: center;
  justify-content: center;
}

.uni-load-more__text {
  font-size: 28rpx;
  color: #999;
}

.uni-load-more__img {
  height: 24px;
  width: 24px;
  margin-right: 10px;
}

.uni-load-more__img > view {
  position: absolute;
}

.uni-load-more__img > view view {
  width: 6px;
  height: 2px;
  border-top-left-radius: 1px;
  border-bottom-left-radius: 1px;
  background: #999;
  position: absolute;
  opacity: 0.2;
  transform-origin: 50%;
  animation: load 1.56s ease infinite;
}

.uni-load-more__img > view view:nth-child(1) {
  transform: rotate(90deg);
  top: 2px;
  left: 9px;
}

.uni-load-more__img > view view:nth-child(2) {
  transform: rotate(180deg);
  top: 11px;
  right: 0;
}

.uni-load-more__img > view view:nth-child(3) {
  transform: rotate(270deg);
  bottom: 2px;
  left: 9px;
}

.uni-load-more__img > view view:nth-child(4) {
  top: 11px;
  left: 0;
}

.load1,
.load2,
.load3 {
  height: 24px;
  width: 24px;
}

.load2 {
  transform: rotate(30deg);
}

.load3 {
  transform: rotate(60deg);
}

.load1 view:nth-child(1) {
  animation-delay: 0s;
}

.load2 view:nth-child(1) {
  animation-delay: 0.13s;
}

.load3 view:nth-child(1) {
  animation-delay: 0.26s;
}

.load1 view:nth-child(2) {
  animation-delay: 0.39s;
}

.load2 view:nth-child(2) {
  animation-delay: 0.52s;
}

.load3 view:nth-child(2) {
  animation-delay: 0.65s;
}

.load1 view:nth-child(3) {
  animation-delay: 0.78s;
}

.load2 view:nth-child(3) {
  animation-delay: 0.91s;
}

.load3 view:nth-child(3) {
  animation-delay: 1.04s;
}

.load1 view:nth-child(4) {
  animation-delay: 1.17s;
}

.load2 view:nth-child(4) {
  animation-delay: 1.3s;
}

.load3 view:nth-child(4) {
  animation-delay: 1.43s;
}

@-webkit-keyframes load {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0.2;
  }
}
</style>
