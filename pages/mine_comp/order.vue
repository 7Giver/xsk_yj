<template>
  <view class="content">
    <!-- <view class="navbar"> -->
    <scroll-view class="navbar" :scroll-left="scrollBar" scroll-with-animation scroll-x="true">
      <view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex == index }" @click="tabClick(index)">{{ item.text }}</view>
    </scroll-view>
    <!-- </view> -->

    <swiper :current="tabCurrentIndex" class="swiper-box" :style="{height:height}" duration="300" @change="changeTab">
      <swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
        <scroll-view class="list-scroll-content" scroll-y @scrolltolower="getOrder">
          <!-- 空白页 -->
          <empty setSrc="https://cdn.swh296.com/img/common/empty_content.png" v-if="!tabItem.loadmore">
            <view class="empty-text">
              暂时还没有订单哦~
            </view>
          </empty>
          <view v-for="(item, index) in tabItem.orderList" :key="index" class="order-item">
            <view class="i-top b-b" @click="_toStore(item.pay_order_list[0].storeinfo.id)">
              <text class="store-name">{{ item.pay_order_list[0].storeinfo.name }}</text>
              <text class="state" :style="{ color: item.pay_order_list[0].store_order_list.stateTipColor }">{{ item.pay_order_list[0].store_order_list.state_tip }}</text>
              <!-- <text v-if="item.state === 9" class="del-btn yticon icon-iconfontshanchu1" @click="deleteOrder(index)"></text> -->
            </view>
            <scroll-view v-if="item.pay_order_list[0].store_order_list.products.length > 1" class="goods-box" scroll-x>
              <view v-for="(goodsItem, goodsIndex) in item.pay_order_list[0].store_order_list.products" :key="goodsIndex" @click="_toGoods(goodsItem.product_id)" class="goods-item">
                <image class="goods-img" :src="goodsItem.images_text[0]" mode="aspectFill"></image>
              </view>
            </scroll-view>
            <view v-if="item.pay_order_list[0].store_order_list.products.length === 1" class="goods-box-single" @click="_toGoods(goodsItem.product_id)" v-for="(goodsItem, goodsIndex) in item.pay_order_list[0].store_order_list.products" :key="goodsIndex">
              <view class="t-cont">
                <image class="goods-img" :src="goodsItem.images_text[0]" mode="aspectFill"></image>
                <view class="center">
                  <text class="title clamp">{{ goodsItem.title }}</text>
                  <text class="attr-box">规格:{{ goodsItem.attributes }}</text>
                  <text class="time" v-if="item.pay_order_list[0].store_order_list.service_time">预约服务时间:{{ item.pay_order_list[0].store_order_list.service_time_text }}</text>
                </view>
               <view class="right">
                  <text class="price">{{ goodsItem.product_price }}</text>
                  <text class="num">x{{ goodsItem.quantity }}</text>
                </view>
              </view>
            </view>
            <!-- buyer_review != 1 是未评论 -->
            <!-- 0 待付款 1 已支付 6 已支付未发货 7 已支付待收货  3开始售后 4售后完成 1 取消订单    5 订单完成  2已收货  -->
            <view class="action-box">
              <view class="total-num">
                <text class="num-l">总计:<text>￥ {{ item.pay_order_list[0].store_order_list.products_price }}</text></text>
                <!-- <text class="num-freight">包含运费: 0.00</text> -->
              </view>
              <!-- 待付款 -->
              <view class="state-btns" v-if="item.pay_order_list[0].store_order_list.status == 0">
                <button type="default" class="btn-l" :disabled="disabled" @click.stop="_cancelDelivery(item)">取消订单</button>
                <button type="default" class="btn-r" :disabled="disabled" @click.stop="_payDelivery(item.pay_order_list[0].store_order_list)">去付款</button>
              </view>
              <!-- 待发货 -->
              <!-- <view class="state-btns" v-if="item.pay_order_list[0].store_order_list.status == 6">
                <button class="btn-l" type="default" :disabled="disabled" @click.stop="_remindDelivery(item.pay_order_list[0].store_order_list)">提醒发货</button>
              </view> -->
              <!-- 待收货 -->
            <!--  <view class="state-btns" v-if="item.pay_order_list[0].store_order_list.status == 7">
                <button type="default" class="btn-r" :disabled="disabled" @click.stop="_confirmDelivery(item.pay_order_list[0].store_order_list)">确认收货</button>
              </view> -->
              <!-- 待评价 -->
              <view class="state-btns" v-if="item.pay_order_list[0].store_order_list.products[0].buyer_review != 1 && item.pay_order_list[0].store_order_list.status == 2">
                <button type="default" class="btn-r" :disabled="disabled" @click.stop="_evaluateDelivery(item.pay_order_list[0].store_order_list.products[0])">去评价</button>
              </view>
              <!-- 售后中 -->
              <view class="state-btns" v-if="item.pay_order_list[0].store_order_list.status == 3">
                <button type="default" class="btn-r" :disabled="disabled" @click.stop="_aftersaleDelivery(item.pay_order_list[0].store_order_list)">查看详情</button>
              </view>
              <!-- 售后完成 -->
          <!--    <view class="dfk" v-if="item.pay_order_list[0].store_order_list.status == 4">
                <button type="default"></button>
              </view> -->
            </view>
          </view>
          <uni-load-more  v-if="tabItem.loadmore" :status="tabItem.loadingType"></uni-load-more>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from '@/components/empty';
import Json from '@/Json';
import {mapState,mapMutations} from 'vuex';
import {requestPayment} from '../../common/js/commonInfo.js'
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
         loadingType: 'more',
         orderList: [],
         page:1,
         loadmore:true
       },
       {
         state: 1,
         text: '待付款',
         loadingType: 'more',
         orderList: [],
         page:1,
         loadmore:true
       },
       {
         state: 6,
         text: '待发货',
         loadingType: 'more',
         orderList: [],
         page:1,
         loadmore:true
       },
       {
         state: 7,
         text: '待收货',
         loadingType: 'more',
         // isSale:true,
         orderList: [],
         page:1,
         loadmore:true
       },
       {
         state: 3,
         text: '待评价',
         loadingType: 'more',
         // isSale:true,
         orderList: [],
         page:1,
         loadmore:true
       },
       {
         state: 4,
         text: '售后/退款',
         loadingType: 'more',
         // isSale:true,
         orderList: [],
         page:1,
         loadmore:true
       }
      ],
      scrollBar:0,
      height:'',
      page:1,
      limit:10,
      loadmore:true,
      disabled:false
    };
  },
  computed:{
    ...mapState(['token'])
  },
  onLoad(options) {
    console.log(options)
    this.height = uni.getSystemInfoSync().windowHeight - 40 +'px'
    this.tabCurrentIndex =options.id ||  0
    this.scrollBar = this.tabCurrentIndex * 50
    this.getOrder()
  },
  onShow() {
    // this.height = uni.getSystemInfoSync().windowHeight - 40 +'px'
    // this.tabCurrentIndex = 0
    // this.getOrder()
  },
  // created() {
  //   this.height = uni.getSystemInfoSync().windowHeight - 40 +'px'
  //   this.tabCurrentIndex = 0
  //   // this.loadData();
  //   this.getOrder()
  // },
  methods: {
    ...mapMutations({
      setStoreId:'setStoreId'
    }),
    _toStore(id){
      this.setStoreId(id)
      uni.navigateTo({
        url:`/pages/router-page/home`
      })
    },
    _toGoods(id){
      uni.navigateTo({
        url:`/pages/product/product?id=${id}`
      })
    },
    // 售后中 查看详情
    _aftersaleDelivery(){
      
    },
    // 去评价
    _evaluateDelivery(goods){
      uni.navigateTo({
        url:`/pages/mine_comp/evaluate?id=${goods.id}`
      })
    },
    //确认收货
    _confirmDelivery(){
      
    },
    //提醒发货
    _remindDelivery(){
      
    },
    //取消订单
    _cancelDelivery(item){
      this.cancelPay(item)
    },
    //去付款
    _payDelivery(goods){
      console.log(goods.out_trade_no)
      this.pay(goods.out_trade_no)
    },
    cancelPay(item){
      this.disabled=true
      this.$http
        .post(`/addons/xshop/order/cancelPay`,{
          token:this.token,
          id:item.payinfo.id
        } )
        .then(response => {
          const data = response.data;
          console.log('data', data);
          if (response.code == 1) {
            this.$api.msg('取消成功')
            this.$set(item.pay_order_list[0].store_order_list,'state_tip','已取消')
            this.$set(item.pay_order_list[0].store_order_list,'status','-1')
          }else{
            this.disabled=false
            this.$api.msg(response.msg)
          }
        })
    },
    pay(order_sn){
      this.disabled=true
      this.loading=true
      this.$http
        .post(`/addons/epay/order/pay`,{
          order_sn:order_sn
        } )
        .then(response => {
          const data = response.data;
          console.log('data', data);
          if (response.code == 1) {
            // this.requestPayment(data)
            // #ifdef MP-WEIXIN
            requestPayment.call(this,data,function(res){
              console.log('res',res)
               uni.switchTab({
                  url:'/pages/mine/index'
               })
            })
            // #endif
            // #ifdef H5
            if (this.$jwx && this.$jwx.isWechat()) {
              console.log('this.$jwx--data:',data)
              _this.disabled=false
              this.$jwx.wxpay(data,function(res){
                  console.log('res:H5支付',res)
              })
            }
            // #endif
          }else{
             this.$api.msg(response.msg)
          }
        })
    },
    _toSelfOrderDetail(item){
      uni.navigateTo({
        url:`/pages/store_manage_comp/order_detail?id=${item.id}`
      })
    },
    getOrder(source){
      let navItem = this.navList[this.tabCurrentIndex];
      let state = navItem.state;
      if (source === 'tabChange' && navItem.loaded === true) {
        if(navItem.page==1 && navItem.orderList.length==0){
          // this.loadmore = false
          navItem.loadmore = false
        }else{
          // this.loadmore = true
          navItem.loadmore = true
        }
        //tab切换只有第一次需要加载数据
        return;
      }
      if (navItem.loadingType === 'loading') {
        //防止重复加载
        return;
      }
      navItem.loadingType = 'loading';
      this.$http
        .post(`/addons/xshop/order/list`,{
          token:this.token,
          state:state,
          page:navItem.page || 1
        })
        .then(response => {
          const data = response.data;
          uni.hideLoading()
          this.loading = false
          if (response.code === 1) {
            let resultData = data
            console.log('resultData',resultData)
            // let resultData = []
            // this.orderData =resultData
            if(navItem.page==1){
              console.log('resultData.length<this.limit',resultData,resultData.length,this.limit)
              if(resultData.length<this.limit){
                if(resultData.length ==0) {
                  // this.loadmore = false
                  navItem.loadmore = false
                }else{
                  // this.loadmore = true
                  navItem.loadmore = true
                }
                navItem.loadingType = 'noMore';
                this.$set(navItem, 'loaded', true);
              }else{
                // this.loadmore = true
                navItem.loadmore = true
                navItem.page ++
                navItem.loadingType = 'more';
              }
              navItem.orderList = resultData
            }else {
              navItem.page ++
              if(resultData.length<this.limit){
                navItem.loadingType = 'noMore';
                this.$set(navItem, 'loaded', true);
              }else{
                // navItem.page ++
                // navItem.orderList = navItem.orderList.concat(resultData)
                navItem.loadingType = 'more';
              }
              console.log('navItem',navItem,resultData)
              navItem.orderList = navItem.orderList.concat(resultData)
              // this.loadmore = true
              navItem.loadmore = true
            }
          }else{
            navItem.orderList =[]
            navItem.loadmore = false
          }
        })
    },
    //swiper 切换
    changeTab(e) {
      this.tabCurrentIndex = e.target.current;
      this.scrollBar = this.tabCurrentIndex * 50
      this.getOrder('tabChange');
    },
    //顶部tab点击
    tabClick(index) {
      this.scrollBar = this.tabCurrentIndex * 50
      this.tabCurrentIndex = index
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
  padding: 0 20rpx;
  background: #fff;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 10;
  white-space: nowrap;
  .nav-item {
    display: inline-block;
    padding: 0 25rpx;
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
      color: #FE8619;
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
      .time{
        font-size: $font-sm - 2rpx;
        color: $font-color-light;
        width: 500rpx;
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
    .state-btns{
      float: right;
      @include flexX;
      height: 100%;
      button{
        width:136rpx;
        height:56rpx;
        padding: 0;
        line-height: 56rpx;
        border-radius:14rpx;
        margin-left:20rpx;
        color: #fff;
        font-size: 26rpx;
        &.btn-l{
          background-color: #fff;
          border:1px solid rgba(240, 86, 61, 1);
          color: #F0573D;
        }
        &.btn-r{
          border:1px solid rgba(240, 86, 61, 1);
          background:linear-gradient(-90deg,rgba(242,106,83,1) 0%,rgba(238,67,39,1) 100%);
        }
      }
    }
    .total-num {
      float: left;
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
