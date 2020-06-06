<template>
  <view class="container">
    <view class="address-section">
      <image class="line" src="/static/line.png" mode=""></image>
      <view class="receiver">
        <view class="ser-l">收货地址</view>
        <view class="content">
         <view class="textarea">
            <textarea value="" v-model.trim="receiveAddress" placeholder="请输入收货地址" />
          </view>
        </view>
        <view class="right-arrow"  @click.stop="openAddres('appoint_receive')">
          <text class="yticon icon-you"></text>
        </view>
        <view class="right-location"  @click.stop="_authReceiveLocaiton" >
          <image class="icon_location" src="../../static/icon_location.png" mode=""></image>
        </view>
      </view>
    </view>
    <view class="tb-list">
      <view class="service-item "><text class="ser-l">服务详情</text></view>
      <view class="green_detail">
        <view class="meal clamp_two">
          <text style="margin-right: 4px;">套餐{{greensInfo.id }}:</text>
          <text v-for="(item,index) in greensInfo.list" :key="index"> {{ item.name}}</text>
        </view>
        <view class="price">
          <view class="item-r">
            <view class="day">
              <text class="price">50元</text>
            </view>
              <!-- :isMax="sitem.quantity >= sitem.sku.stock ? true : false" -->
              <!-- :max="sitem.sku.stock" -->
              <view>
                <uni-number-box
                  class="step"
                  :min="1"
                  :productId='productId'
                  :value="meal_quality"
                  :isMin="meal_quality == 1"
                  @eventChange="numberChange"
                ></uni-number-box>
              </view>
          </view>
        </view>
      </view>
    </view>
    <view class="service-item time" @click.stop="_showMask">
      <text class="ser-l">服务时间</text>
      <view class="ser-r">
        <text class="time">{{ sendTime }}</text>
        <hTimeAlert
          title="预约服务时间"
          subhead=""
          rangeStartTime="8:00:00"
          rangeEndTime="22:00:00"
          defaultTime="2020/3/29 18:00:00"
          intervalTime="30"
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
        <text class="yticon icon-you"></text>
      </view>
    </view>
    <view class="tb-list">
      <view class="service-item "><text class="ser-l">备注</text></view>
      <view class="input-inner"><textarea value="" v-model="user_remark" placeholder="请输入代取件的物品" /></view>
    </view>
    <view class="price-section">
      <view class="service-item">
        <text class="ser-l">商品总价</text>
        <view class="ser-r"><text class="price-text">￥50</text></view>
      </view>
      <view class="service-item coupon">
        <text class="ser-l">服务费</text>
        <view class="ser-r"><text class="price-text">￥5</text></view>
      </view>
      <view class="service-item coupon" v-if="!couponDiscount.member">
        <text class="ser-l">优惠券</text>
        <view class="ser-r"><text class="coupon-text">{{couponDiscount.canuse_times}}张</text></view>
      </view>
    </view>
    <view style="height: 70px"> 
    </view>
    <view class="footer">
      <view class="price-content">
        <text>实付款</text>
        <text class="price-tip">￥</text>
        <text class="price">{{order_price}}</text>
        <text class="m-price" v-if="iscandiscount">（已抵扣5元）</text>
      </view>
      <!-- <text class="submit" @click="submit">提交订单</text> -->
      <button class="cu-btn submit" :disabled="disabled" @click="submit">立即支付</button>
    </view>
<!--    <simple-address
      ref="simpleAddress"
      :pickerValueDefault="cityPickerValueDefault"
      @onConfirm="onConfirm"
      themeColor="#007AFF"
    ></simple-address> -->
  </view>
</template>

<script>
// import simpleAddress from '@/components/simple-address/simple-address.vue'
import hTimeAlert from '@/components/h-time-alert/h-time-alert.vue';
import {chooseLocation,requestPayment} from '../../common/js/commonInfo.js'
import uniNumberBox from '@/components/uni-number-box.vue';
const timePrice = 50
export default {
  components: { 
    hTimeAlert,
    // simpleAddress,
    uniNumberBox
  },
  data() {
    return {
      optData:{},
      userRemark:[],
      isShow: false,
      maskHide: false,
      closeBtn: false,
      rangeType: true,
      sendTime: '',
      sendTime1: '',
      disabled:false,
      cityPickerValueDefault: [0, 0, 1],
      pickTude:{
       longitude:'',
       latitude:''
      },
      pickAddress:'',
      receiveAddress:'',
      user_remark:'',
      canuse_times:'',
      receiveCode:'', //取件码
      couponDiscount:{
        canuse_times:''
      },
      meal_quality:1,
      productId:0,
      greensInfo:{},
      time_price:timePrice,
      order_price:''
    }
  },
  computed:{
    iscandiscount(){
      return this.couponDiscount.canuse_times > 0 || this.couponDiscount.member ? true:false
    },
    // order_price(){
    //   return this.iscandiscount ? 50 : 55
    // }
  },
  onLoad(options){
    this.optData =JSON.parse(options.optData)
    this.user_remark = this.optData.value || ''
    this.greensInfo = uni.getStorageSync('mealList')
    console.log(this.greensInfo)
    this.canDiscount()
  },
  methods: {
    numberChange(data) {
      this.quantity = data.number || 1
      if(this.iscandiscount){
        this.order_price = this.time_price =  data.number * 50
      }else{
        this.order_price = this.time_price =  data.number * 50 + 5
      }
    },
    _authReceiveLocaiton(e){
      var _this = this
      // #ifdef MP-WEIXIN
      chooseLocation(function(res){
        console.log('res',res)
        _this.receiveAddress = res.name
        })
      // #endif
      // #ifdef H5
        _this.$jwx.getlocation(function(response){
          console.log('response',response)
          // #ifdef H5
          uni.chooseLocation({
              success: function (res) {
               _this.receiveAddress = res.name
              }
          })
          // #endif
        })
      // #endif
    },
    openAddres(data) {
      uni.navigateTo({
        url:`/pages/address/address?source=${data}`
      })
    	// this.cityPickerValueDefault = [0,0,0]
    	// this.$refs.simpleAddress.open();
    },
    onConfirm(e) {
      let labelArr =  e.labelArr
      this.receiveAddress = labelArr.join('')
    },
    _chooseDelivery(){
      uni.navigateTo({
        url:'/pages/appoint/expressage'
      })
    },
    submit(){
      if(this.receiveAddress == ''){
        this.$api.msg('请输入收货地址~')
        return
      }
      if(!this.sendTime){
        this.$api.msg('请选择服务时间~')
        return
      }
      this.addOrder()
    },
    _showMask() {
      this.isShow = !this.isShow;
    },
    maskClose() {
      this.isShow = false;
    },
    handelClose(data) {
      this.isShow = false;
      this.sendTime = data._dateRange;
      this.sendTime1 = data._date;
      //data={
      //  date: "2020/3/30 09:00"
      //  _date: "2020-3-30 09:00"
      //  dateRange: "2020/3/30 09:00-09:30"
      //  _dateRange: "2020-3-30 09:00-09:30"
      //  timeStamp: 1585530000000
      // }
    },
   orderPay(order){
     this.disabled = true
     var _this = this
     let method = ''
     // #ifdef H5
     method = 'mp'
     // #endif
     // #ifdef MP-WEIXIN
     method = 'miniapp'
     // #endif
     this.$http
       .post(`/addons/microlife/order/pay`,{
         out_trade_no:order,
         method:method
       })
       .then(response => {
         this.disabled = false
         const data = response.data
        if (response.code == 1) {
          // #ifdef MP-WEIXIN
          requestPayment.call(this,data,function(res){
              this.$api.msg('支付成功~')
              setTimeout(()=>{
                uni.navigateTo({
                  url:`/pages/appoint/home?page='appoint-order'`
                })
              },800)
          })
          // #endif
          // #ifdef H5
          if (this.$jwx && this.$jwx.isWechat()) {
            console.log('this.$jwx--data:',data)
            _this.disabled=false
            this.$jwx.wxpay(data,function(res){
                console.log('res:H5支付',res)
                this.$api.msg('支付成功~')
                setTimeout(()=>{
                  uni.navigateTo({
                    url:`/pages/appoint/home?page='appoint-order'`
                  })
                },800)
               
                // alert(`JSON.stringify(${res})`)
            })
          }
          // #endif
        }else{
          this.disabled=false
           this.$api.msg(response.msg)
        }
       });
   },
    // 可用优惠券数量
    canDiscount(){
      var _this = this
      this.$http
        .post(`/addons/microlife/coupon/canDiscount`)
        .then(response => {
          const data = response.data
          if (response.code === 1) {
            this.couponDiscount = data
            if(data.canuse_times > 0 || this.couponDiscount.member){
               this.order_price =   50 
            }else{
              this.order_price =   55
            }
          }
        })
    },
     addOrder(){
      var _this = this
      this.disabled = true
      // type:备注类型:1=洗衣,3=快递,4=代取件
      let service_details = ''
      // service_details =JSON.stringify([{
      //   value:this.optData.green_value
      // }])
      this.$http
        .post(`/addons/microlife/order/add`,{
          type:this.optData.type,
          quantity:this.quantity,
          user_remark:this.user_remark,
          pull_lng:this.pickTude.longitude,
          pull_lat:this.pickTude.latitude,
          pull_address:this.pickAddress,
          send_address:this.receiveAddress,
          service_start_time:this.sendTime1,
          service_details:service_details
        })
        .then(response => {
          const data = response.data
          if (response.code === 1) {
            if(data.pay_status == 0){
              this.orderPay(data.out_trade_no)
            }else{
              this.$api.msg('支付成功~')
              setTimeout(()=>{
                uni.navigateTo({
                  url:`/pages/appoint/home?page=appoint-order`
                })
              },500)
            }
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'mixin.scss';
  /deep/.uni-numbox-minus,/deep/.uni-numbox-plus{
    width: 32rpx;
    height: 32rpx;
    border: none !important;
    background-color: #ECCA9D;
    border-radius: 50%;
    @include flexY;
    @include flexJ;
    .yticon{
      color: #fff;
      font-size: 20rpx;
    }
  }
  /deep/.uni-numbox{
    width: auto;
    // margin-left: 25rpx;
    position: relative;
    border: none;
  }
page,
.container {
  background-color: #f7f9fb;
}
.container {
  padding: 0 30rpx;
}
.icon-you{
  color: #B5B7C7;
}
.address-section{
  padding: 0 30rpx 30rpx;
  border-radius: 6rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
  .line{
    width: 690rpx;
    height: 8rpx;
  }
  .receiver{
    padding-top: 20rpx;
    display: flex;
    // @include flexX;
    // @include flexA;
    font-size: 32rpx;
    color: #131A31;
    .ser-l {
      width: 22%;
      font-weight: bold;
    }
  }
  .content{
    flex: 1;
    margin: -10rpx 20rpx 0 40rpx;
    .textarea{
      width: 100%;
      textarea {
        width: 90%;
        font-size: 26rpx;
        height: 110rpx;
        // padding: 20rpx 0;
        padding-top: 5rpx;
      }
    }
  }
  .right-arrow{
    width: 50rpx;
    height: 50rpx;
    margin-right: 20rpx;
    @include flexY;
    @include flexA;
    // justify-content: center;
    // margin-top: 12rpx;
    text{
      // float: right;
    }
    // justify-content: flex-end;
  }
  .right-location{
    width:  50rpx;
    height: 50rpx;
    @include flexY;
    @include flexA;
    .icon_location{
      width: 24rpx;
      height: 32rpx;
    }
  }
}
.tb-list{
  background-color: #fff;
  margin-bottom: 20rpx;
  .service-item{
    padding-top: 30rpx;
    margin-bottom: 0;
  }
  .input-inner{
    padding: 0 30rpx;
  }
  .green_detail{
    position: relative;
    padding: 35rpx 0 35rpx 30rpx;
    @include flexX;
    .meal{
      color: #757E90;
      flex: 1;
    }
    .item-r{
      width: 200rpx;
      @include flexY;
      @include flexJ;
      @include flexA;
      justify-content:right;
      border-left: 1px solid #e6e6e6;
      .day{
        color: #757E90;
        font-size: 28rpx;
        .price{
          font-size: 34rpx;
          color: #F75347;
        }
      }
    }
  }
}
.input-inner {
    flex: 1;
    textarea {
      width: 90%;
      font-size: 26rpx;
      height: 110rpx;
      padding: 20rpx 0;
    }
  }
  .price-section{
    background-color: #fff;
    padding: 40rpx 0;
    .service-item{
      margin-bottom: 0;
      &.coupon{
      margin-top: 40rpx;
    }
      .price-text{
        font-size: 28rpx;
        color: #F75347;
      }
      .coupon-text{
        font-size: 26rpx;
        color: #757E90;
      }
    }
  }
.service-item {
  position: relative;
  padding: 0 30rpx;
  border-radius: 6rpx;
  @include flexSB;
  background-color: #fff;
  margin-bottom: 20rpx;
  &.time {
    height: 110rpx;
  }
  .ser-l {
    width: 22%;
    font-weight: bold;
  }

  .ser-r {
    flex: 1;
    color: #757e90;
    position: relative;
    @include flexX;
    justify-content: flex-end;
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
      height: 110rpx;
      justify-content: space-between;
      font-size: 32rpx;
      background-color: #fff;
      z-index: 5;
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
      .m-price{
        font-size: 24rpx;
        color: #909399;
        // text-decoration: line-through;
      }
      .submit {
        width:200rpx;
        height:74rpx;
        border-radius: 14rpx;
        margin-right: 40rpx;
        background:linear-gradient(90deg,rgba(247,83,71,1),rgba(251,73,85,1));
        font-size: 30rpx;
        color: #fff;
      }
    }
</style>
