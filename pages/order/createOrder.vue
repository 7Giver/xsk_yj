<template>
  <view>
    <!-- 地址 -->
    <navigator url="/pages/address/address?source=1" class="address-section">
      <view class="order-content">
        <text class="yticon icon-shouhuodizhi"></text>
        <view class="cen" v-if="addressData.contactor_name">
          <view class="top">
            <text class="name">{{ addressData.contactor_name }}</text>
            <text class="mobile">{{ addressData.phone }}</text>
            <text v-if="addressData.is_default" class="tag">默认</text>
          </view>
          <text class="address">{{ addressData.address }} {{ addressData.street }}</text>
        </view>
        <view class="cen" v-else>请填写收货地址</view>
        <text class="yticon icon-you"></text>
      </view>
    </navigator>
    <view class="splitCls" v-if="can_appoint"></view>
    <view class="sendtime-section" v-if="can_appoint" @click.stop="_showMask">
      <text class="appoint">预约服务时间</text>
      <text class="time">{{sendTime}}</text>
      <hTimeAlert
        title="预约服务时间"
        subhead=""
        rangeStartTime="8:00:00"
        rangeEndTime="22:00:00"
        defaultTime="2020/3/29 18:00:00"
        intervalTime="15"
        dayStartIntTime="0"
        rangeDay="10"
        disabled="0,2"
        :isShow="isShow"
        :maskHide="maskHide"
        :rangeType="rangeType"
        :closeBtn="closeBtn"
        @_maskClose="maskClose"
        @closeAlert="handelClose"
      ></hTimeAlert>
    </view>
    <view class="goods-section" v-for="(item, index) in productList" :key="index">
      <view class="g-header b-b">
        <image class="logo" :src="item.store.log_image_text"></image>
        <text class="name">{{ item.store.name }}</text>
      </view>
      <!-- 商品列表 -->
      <view class="g-item" v-for="(s, i) in item.list" :key="i">
        <image :src="s.product.image[0]"></image>
        <view class="right">
          <text class="title clamp">{{ s.product.title }}</text>
          <text class="spec">{{ s.sku.value }}</text>
          <view class="price-box">
            <text class="price">￥{{ s.sku.price }}</text>
            <text class="number">x {{ s.quantity }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 优惠明细 -->
    <view class="yt-list">
      <view class="yt-list-cell b-b">
        <view class="cell-icon">券</view>
        <text class="cell-tit clamp">优惠券</text>
        <text class="cell-tip active" @click="toggleMask('show')" v-if="usableCouponList.length > 0">{{ couponText }}</text>
        <text class="cell-tip no-coup" @click="_noCoupon" v-else>暂无优惠券</text>
        <text class="cell-more wanjia wanjia-gengduo-d"></text>
      </view>
      <view class="yt-list-cell desc-cell">
        <text class="cell-tit clamp">备注</text>
        <input class="desc" type="text" v-model="desc" placeholder="选填，可以告诉我们您的特殊要求" placeholder-class="placeholder" />
      </view>
      <!-- <view class="yt-list-cell b-b">
				<view class="cell-icon hb">
					减
				</view>
				<text class="cell-tit clamp">商家促销</text>
				<text class="cell-tip disabled">暂无可用优惠</text>
			</view> -->
    </view>
    <!-- 金额明细 -->
    <view class="yt-list" v-if="false">
      <view class="yt-list-cell b-b">
        <text class="cell-tit clamp">商品金额</text>
        <text class="cell-tip">￥179.88</text>
      </view>
      <view class="yt-list-cell b-b">
        <text class="cell-tit clamp">优惠金额</text>
        <text class="cell-tip red">-￥35</text>
      </view>
      <view class="yt-list-cell b-b">
        <text class="cell-tit clamp">运费</text>
        <text class="cell-tip">免运费</text>
      </view>
      <view class="yt-list-cell desc-cell">
        <text class="cell-tit clamp">备注</text>
        <input class="desc" type="text" v-model="desc" placeholder="请填写备注信息" placeholder-class="placeholder" />
      </view>
    </view>
    <view style="height: 60px"></view>
    <!-- 底部 -->
    <view class="footer">
      <view class="price-content">
        <text>实付款</text>
        <text v-if="addressData.contactor_name" class="price-tip">￥</text>
        <text v-if="addressData.contactor_name" class="price">{{ order_price }}</text>
        <text v-else class="price">--</text>
      </view>
      <!-- <text class="submit" @click="submit">提交订单</text> -->
      <button class="cu-btn submit" :disabled="disabled" @click="submit">立即支付</button>
    </view>

    <!-- 优惠券面板 -->
    <view class="mask" :class="maskState === 0 ? 'none' : maskState === 1 ? 'show' : ''" @click="toggleMask">
      <view class="mask-content" @click.stop.prevent="stopPrevent">
        <!-- 优惠券页面，仿mt -->
        <view class="coupon-item" v-for="(item, index) in usableCouponList" @click="_chooseCoupon(item)" :key="index">
          <view class="con">
            <view class="left">
              <text class="title">{{ item.coupon.name }}</text>
              <text class="time">有效期至{{ item.coupon.use_end_time_text }}</text>
            </view>
            <view class="right">
              <text class="price">{{ item.coupon.money }}</text>
              <!-- <text>满30可用</text> -->
            </view>

            <view class="circle l"></view>
            <view class="circle r"></view>
          </view>
          <text class="tips">{{ item.coupon.desc }}</text>
        </view>
      </view>
    </view>
    <rf-loading v-if="isLoaded"></rf-loading>
    <!-- <tui-modal :show="isSkuEmptyModal" @click="handleClickSku" @cancel="hideSku" :content="isSkuContent" :button="isSkuButton" :maskClosable="false"></tui-modal> -->
  </view>
</template>

<script>
import hTimeAlert from "@/components/h-time-alert/h-time-alert.vue";
import tuiModal from "@/components/ThorUI/modal/modal"
import { mapState } from 'vuex';
export default {
  components: {hTimeAlert},
  data() {
    return {
      maskState: 0, //优惠券面板显示状态
      desc: '', //备注
      payType: 1, //1微信 2支付宝
      usableCouponList: [ //可用优惠券
      ],
      addressData: {
        id:''
      },
      product_id: '',
      productList: [], //选商品
      productInfo: {}, //商品信息(前一个页面传值)
      coupon_id:'', //可用优惠券id
      couponText:'选择优惠券',
      order_price:'',
      disabled:false,
      loading:false,
      isLoaded:true,
      params:{},
      // 
      can_appoint:false,
      isShow: false,
      maskHide: false,
      closeBtn: false,
      rangeType: false,
      sendTime:'',
      sendTime1:'',
      isSkuButton: [{
      	text: "确定",
      	type: 'red'
      }],
      isSkuEmptyModal:false,
      isSkuContent:''
      // 
    };
  },
  computed: {
    ...mapState(['token'])
  },
  onLoad(options) {
    uni.showLoading({
      title:'加载中...'
    })
    if(options.form){
      this.productInfo = JSON.parse(options.form);
      this.product_id = this.productInfo.sku_id
    }
    if(this.productInfo.sku_id){
      this.params = {
        token: this.token,
        sku_id: this.productInfo.sku_id,
        quantity: this.productInfo.quantity
      }
    }else{
      this.params = {
        token: this.token
      }
    }
    this.getAddress();
    this.cart();
    this.usableCoupon()
    // this.getProductCoupon();
  },
  watch: {
    addressData(newValue, oldValue) {
      this.addressData.id = newValue.id
    }
  },
  methods: {
     // hideSku(){
     //   this.isSkuEmptyModal = false
     // },
     // handleClickSku(){
     //   this.isSkuEmptyModal = false
     // },
     _showMask() {
          this.isShow = !this.isShow;
      },
      maskClose(){
        this.isShow = false
      },
      handelClose(data) {
          this.isShow = false;
          this.sendTime = data._dateRange 
          this.sendTime1 = data._date 
          //data={
          //  date: "2020/3/30 09:00"
          //  _date: "2020-3-30 09:00"
          //  dateRange: "2020/3/30 09:00-09:30"
          //  _dateRange: "2020-3-30 09:00-09:30"
          //  timeStamp: 1585530000000
          // }
      },
    // 获取商品
    cart() {
      let params = {}
      if(!this.productInfo.sku_id){
        this.params = Object.assign(this.params,{type:1})
      }
      this.$http
        .post(`/addons/xshop/cart/list`,this.params )
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            this.isLoaded = false
            uni.hideLoading()
            this.productList = data;
            let can_appoint = ''
            can_appoint = data.some(v=>{
              return v.list.some(s=>{
                return s.product.is_can_appoint == 1
              })
            })
            this.can_appoint = can_appoint
          }
        });
    },
    // 订单可用优惠券 提交订单付款时
    usableCoupon() {
      this.$http
        .post(`/addons/xshopcoupon/coupon/usableCoupon`,this.params )
        .then(response => {
          const data = response.data
          if (response.code === 1) {
            this.usableCouponList =data
          }
        });
    },
    // 选择地址 优惠券 计算价格 price
    getPrice() {
      this.$http
        .post(`/addons/xshop/order/getPrice`, {
          token: this.token,
          address_id: this.addressData.id,
          coupon_id: this.coupon_id
        })
        .then(response => {
          const data = response.data;
          if (response.code == 1) {
            if(data.discount_price){
              this.couponText ='-' + data.discount_price
            }
            this.order_price = data.order_price
          }
        });
    },
    getProductCoupon() {
      let params = {}
      if(this.product_id){
        params = {
          token: this.token,
          id: this.product_id
        }
      }else{
        params={
          token: this.token,
        }
      }
      this.$http
        .post(`/addons/xshopcoupon/coupon/getProductCoupon`,params)
        .then(response => {
          const data = response.data;
          if (response.code == 1) {
            this.couponList = data;
          }
        });
    },
    getAddress() {
      this.$http
        .post(`/addons/xshop/user/getAddress`, {
          token: this.token
        })
        .then(response => {
          const data = response.data;
          if (response.code == 1) {
            if (data.length > 0) {
              this.addressData = data[0]
              this.getPrice()
            }
          }
        });
    },
    orderAdd() { //下订单
    let params = Object.assign(this.params,{
          address_id: this.addressData.id,
          coupon_id: this.coupon_id,
          remark: this.desc,
          service_time:this.sendTime1
        })
      this.$http
        .post(`/addons/xshop/order/add`,params )
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            this.pay(data)
            // this.productList = data
          }else{
            this.disabled = false
            this.$api.msg(response.msg)
          }
        });
    },
    pay(order_sn){
      var _this = this
      this.disabled=true
      this.loading=true
      this.$http
        .post(`/addons/epay/order/pay`,{
          order_sn:order_sn,
          method:'mp'
        } )
        .then(response => {
          const data = response.data;
          console.log('data', data);
          if (response.code == 1) {
            // #ifdef MP-WEIXIN
            this.requestPayment(data)
            // #endif
            // #ifdef H5
            if (this.$jwx && this.$jwx.isWechat()) {
              console.log('this.$jwx--data:',data)
              _this.disabled=false
              this.$jwx.wxpay(data,function(res){
                  console.log('res:H5支付',res)
                  // alert(`JSON.stringify(${res})`)
              })
            }
            // #endif
          }else{
            this.disabled=false
             this.$api.msg(response.msg)
          }
        })
    },
    requestPayment(paymentData){
      uni.requestPayment({
          timeStamp: paymentData.timeStamp,
          nonceStr: paymentData.nonceStr,
          package: paymentData.package,
          signType: 'MD5',
          paySign: paymentData.paySign,
          success: (res) => {
             this.$api.msg('支付成功')
             this.disabled=false
             this.loading=false
             uni.switchTab({
                url:'/pages/mine/index'
             })
          },
          fail: (res) => {
            this.disabled=false
            this.loading=false
            // 原因为: " + res.errMsg
              uni.showModal({
                  content: "支付失败",
                  showCancel: false
              })
          },
          complete: () => {
              this.loading = false;

          }
      })
    },
    _chooseCoupon(item){
      this.coupon_id = item.id
      this.maskState = 0;
      this.getPrice()
    },
    //显示优惠券面板
    toggleMask(type) {
      let timer = type === 'show' ? 10 : 300;
      let state = type === 'show' ? 1 : 0;
      this.maskState = 2;
      setTimeout(() => {
        this.maskState = state;
      }, timer);
    },
    _noCoupon() {
      this.$api.msg('当前暂无优惠券可用~');
    },
    numberChange(data) {
      this.number = data.number;
    },
    changePayType(type) {
      this.payType = type;
    },
    submit() {
      if(this.addressData.id){
        this.disabled = true
        this.orderAdd()
      }else{
        this.$api.msg('请选择收获地址')
      }
    },
    stopPrevent() {}
  }
};
</script>

<style lang="scss">
@import 'mixin.scss';
page {
  background: $page-color-base;
  padding-bottom: 100rpx;
}
.sendtime-section{
  position: relative;
  padding: 0 30rpx;
  height: 84rpx;
  line-height: 84rpx;
  // @include flexSB;
  background-color: #fff;
  text{
    float: left;
    &.appoint{
      color: #f64443;
    }
    &.time{
      float: right;
    }
  }
}
.address-section {
  padding: 30rpx 0;
  background: #fff;
  position: relative;

  .order-content {
    display: flex;
    align-items: center;
  }

  .icon-shouhuodizhi {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90rpx;
    color: #888;
    font-size: 44rpx;
  }

  .cen {
    display: flex;
    flex-direction: column;
    flex: 1;
    font-size: 28rpx;
    color: $font-color-dark;
  }

  .name {
    font-size: 34rpx;
    margin-right: 24rpx;
  }
  .tag {
    font-size: 24rpx;
    color: $base-color;
    margin-right: 10rpx;
    background: #fffafb;
    border: 1px solid #ffb4c7;
    border-radius: 4rpx;
    padding: 4rpx 10rpx;
    line-height: 1;
  }
  .address {
    margin-top: 16rpx;
    margin-right: 20rpx;
    color: $font-color-light;
  }

  .icon-you {
    font-size: 32rpx;
    color: $font-color-light;
    margin-right: 30rpx;
  }

  .a-bg {
    position: absolute;
    left: 0;
    bottom: 0;
    display: block;
    width: 100%;
    height: 5rpx;
  }
}

.goods-section {
  margin-top: 16rpx;
  background: #fff;
  padding-bottom: 1px;

  .g-header {
    display: flex;
    align-items: center;
    height: 84rpx;
    padding: 0 30rpx;
    position: relative;
  }

  .logo {
    display: block;
    width: 50rpx;
    height: 50rpx;
    border-radius: 100px;
  }

  .name {
    font-size: 30rpx;
    color: $font-color-base;
    margin-left: 24rpx;
  }

  .g-item {
    display: flex;
    margin: 20rpx 30rpx;

    image {
      flex-shrink: 0;
      display: block;
      width: 140rpx;
      height: 140rpx;
      border-radius: 4rpx;
    }

    .right {
      flex: 1;
      padding-left: 24rpx;
      overflow: hidden;
    }

    .title {
      font-size: 30rpx;
      color: $font-color-dark;
    }

    .spec {
      font-size: 26rpx;
      color: $font-color-light;
    }

    .price-box {
      display: flex;
      align-items: center;
      font-size: 32rpx;
      color: $font-color-dark;
      padding-top: 10rpx;

      .price {
        margin-bottom: 4rpx;
      }
      .number {
        font-size: 26rpx;
        color: $font-color-base;
        margin-left: 20rpx;
      }
    }

    .step-box {
      position: relative;
    }
  }
}
.yt-list {
  margin-top: 16rpx;
  background: #fff;
}

.yt-list-cell {
  display: flex;
  align-items: center;
  padding: 10rpx 30rpx 10rpx 40rpx;
  line-height: 70rpx;
  position: relative;

  &.cell-hover {
    background: #fafafa;
  }

  &.b-b:after {
    left: 30rpx;
  }

  .cell-icon {
    height: 32rpx;
    width: 32rpx;
    font-size: 22rpx;
    color: #fff;
    text-align: center;
    line-height: 32rpx;
    background: #f85e52;
    border-radius: 4rpx;
    margin-right: 12rpx;

    &.hb {
      background: #ffaa0e;
    }

    &.lpk {
      background: #3ab54a;
    }
  }

  .cell-more {
    align-self: center;
    font-size: 24rpx;
    color: $font-color-light;
    margin-left: 8rpx;
    margin-right: -10rpx;
  }

  .cell-tit {
    flex: 1;
    font-size: 26rpx;
    color: $font-color-light;
    margin-right: 10rpx;
  }

  .cell-tip {
    font-size: 26rpx;
    color: $font-color-dark;

    &.disabled {
      color: $font-color-light;
    }

    &.active {
      color: $base-color;
    }
    &.red {
      color: $base-color;
    }
    &.no-coup {
      color: #c7c7c7;
    }
  }

  &.desc-cell {
    .cell-tit {
      max-width: 90rpx;
    }
  }

  .desc {
    flex: 1;
    font-size: $font-base;
    color: $font-color-dark;
  }
}

/* 支付列表 */
.pay-list {
  padding-left: 40rpx;
  margin-top: 16rpx;
  background: #fff;
  .pay-item {
    display: flex;
    align-items: center;
    padding-right: 20rpx;
    line-height: 1;
    height: 110rpx;
    position: relative;
  }
  .icon-weixinzhifu {
    width: 80rpx;
    font-size: 40rpx;
    color: #6bcc03;
  }
  .icon-alipay {
    width: 80rpx;
    font-size: 40rpx;
    color: #06b4fd;
  }
  .icon-xuanzhong2 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60rpx;
    height: 60rpx;
    font-size: 40rpx;
    color: $base-color;
  }
  .tit {
    font-size: 32rpx;
    color: $font-color-dark;
    flex: 1;
  }
}

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 9;
  display: flex;
  align-items: center;
  width: 100%;
  height: 120rpx;
  justify-content: space-between;
  font-size: 30rpx;
  background-color: #fff;
  z-index: 998;
  color: $font-color-base;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
  .price-content {
    padding-left: 30rpx;
  }
  .price-tip {
    color: $base-color;
    margin-left: 8rpx;
  }
  .price {
    font-size: 36rpx;
    color: $base-color;
  }
  .submit {
    width: 220rpx;
    margin-right: 40rpx;
    height: 90rpx;
    background: linear-gradient(-90deg, rgba(242, 106, 83, 1) 0%, rgba(238, 67, 39, 1) 100%);
    border-radius: 45rpx;
    font-size: 34rpx;
    color: #fff;
  }
}

/* 优惠券面板 */
.mask {
  display: flex;
  align-items: flex-end;
  position: fixed;
  left: 0;
  top: var(--window-top);
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 9995;
  transition: 0.3s;

  .mask-content {
    width: 100%;
    min-height: 30vh;
    max-height: 70vh;
    background: #f3f3f3;
    transform: translateY(100%);
    transition: 0.3s;
    overflow-y: scroll;
  }
  &.none {
    display: none;
  }
  &.show {
    background: rgba(0, 0, 0, 0.4);

    .mask-content {
      transform: translateY(0);
    }
  }
}

/* 优惠券列表 */
.coupon-item {
  display: flex;
  flex-direction: column;
  margin: 20rpx 24rpx;
  background: #fff;
  .con {
    display: flex;
    align-items: center;
    position: relative;
    height: 120rpx;
    padding: 0 30rpx;
    &:after {
      position: absolute;
      left: 0;
      bottom: 0;
      content: '';
      width: 100%;
      height: 0;
      border-bottom: 1px dashed #f3f3f3;
      transform: scaleY(50%);
    }
  }
  .left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    overflow: hidden;
    height: 100rpx;
  }
  .title {
    font-size: 32rpx;
    color: $font-color-dark;
    margin-bottom: 10rpx;
  }
  .time {
    font-size: 24rpx;
    color: $font-color-light;
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 26rpx;
    color: $font-color-base;
    height: 100rpx;
  }
  .price {
    font-size: 44rpx;
    color: $base-color;
    &:before {
      content: '￥';
      font-size: 34rpx;
    }
  }
  .tips {
    font-size: 24rpx;
    color: $font-color-light;
    line-height: 60rpx;
    padding-left: 30rpx;
  }
  .circle {
    position: absolute;
    left: -6rpx;
    bottom: -10rpx;
    z-index: 10;
    width: 20rpx;
    height: 20rpx;
    background: #f3f3f3;
    border-radius: 100px;
    &.r {
      left: auto;
      right: -6rpx;
    }
  }
}
</style>
