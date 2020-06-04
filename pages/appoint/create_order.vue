<template>
  <view class="container">
    <view class="address-section">
      <image class="line" src="/static/line.png" mode=""></image>
      <view class="pick">
        <view class="article pic_bg">
          取
        </view>
        <view class="content">
          <view class="textarea">
            <textarea value="" placeholder="请输入取件地址" />
          </view>
        </view>
        <image class="icon_location" src="../../static/icon_location.png" mode=""></image>
      </view>
      <view class="receiver">
        <view class="article re_bg">
          收
        </view>
        <view class="content">
         <view class="textarea">
            <textarea value="" v-model="receiveAddress" placeholder="请输入取件地址" />
          </view>
        </view>
        <view class="right-sec"  @click.stop="openAddres">
          <text class="yticon icon-you"></text>
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
    <view class="service-item time" @click="_chooseDelivery">
      <text class="ser-l">选择快递</text>
      <view class="ser-r"><text class="yticon icon-you"></text></view>
    </view>
    <view class="text-section">
      <view class="service-item">
        <text class="ser-l">取件码</text>
        <view class="input-inner"><textarea value="" placeholder="如有多个快递，取件码请用“、”隔开, 注*邮寄快递无需填写取件码" /></view>
      </view>
    </view>
    <view class="tb-list">
      <view class="service-item "><text class="ser-l">服务信息</text></view>
      <view class="input-inner"><textarea value="" v-model="serviceMsg" placeholder="如有多个快递，取件码请用“、”隔开, 注*邮寄快递无需填写取件码" /></view>
    </view>
    <view class="tb-list">
      <view class="service-item "><text class="ser-l">物品</text></view>
      <view class="input-inner"><textarea value="" v-model="goodsMsg" placeholder="请输入代取件的物品" /></view>
    </view>
    <view class="price-section">
      <view class="service-item ">
        <text class="ser-l">服务费</text>
        <view class="ser-r"><text class="price-text">￥10</text></view>
      </view>
      <view class="service-item coupon">
        <text class="ser-l">优惠券</text>
        <view class="ser-r"><text class="coupon-text">0张</text></view>
      </view>
    </view>
    <view style="height: 70px"> 
    </view>
    <view class="footer">
      <view class="price-content">
        <text>实付款</text>
        <text class="price-tip">￥</text>
        <text class="price">{{order_price}}</text>
      </view>
      <!-- <text class="submit" @click="submit">提交订单</text> -->
      <button class="cu-btn submit" :disabled="disabled" @click="submit">立即支付</button>
    </view>
    <simple-address
      ref="simpleAddress"
      :pickerValueDefault="cityPickerValueDefault"
      @onConfirm="onConfirm"
      themeColor="#007AFF"
    ></simple-address>
  </view>
</template>

<script>
import simpleAddress from '@/components/simple-address/simple-address.vue'
import hTimeAlert from '@/components/h-time-alert/h-time-alert.vue';
export default {
  components: { hTimeAlert,simpleAddress },
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
      order_price:100,
      disabled:false,
      cityPickerValueDefault: [0, 0, 1],
      receiveAddress:'',
      serviceMsg:'',
      goodsMsg:'' //物品
  }
  },
  onLoad(options){
    this.optData =JSON.parse(options.optData)
    this.serviceMsg = this.optData.value || ''
    console.log(this.optData)
  },
  methods: {
    openAddres() {
    	this.cityPickerValueDefault = [0,0,0]
    	this.$refs.simpleAddress.open();
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
    // 用户备注
    getUserRemark(){
      var _this = this
      this.$http
        .post(`/addons/microlife/remark/user`,{
          type:this.optData.type
        })
        .then(response => {
          const data = response.data
          console.log('getUserRemark',data)
          if (response.code === 1) {
            this.userRemark = data
          }
        });
    },
  }
};
</script>

<style lang="scss" scoped>
@import 'mixin.scss';
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
  .receiver,.pick{
    @include flexX;
    @include flexA;
    font-size: 32rpx;
    color: #131A31;
    .article{
      width:44rpx;
      height:44rpx;
      line-height: 44rpx;
      border-radius:50%;
      font-size:26rpx;
      text-align: center;
      color: #fff;
      &.re_bg{
        background:rgba(246,79,87,1);
      }
      &.pic_bg{
        background:#1795FF;
      }
    }
  }
  .content{
    flex: 1;
    margin: 0 50rpx 0 40rpx;
    .textarea{
      width: 100%;
      textarea {
        width: 90%;
        font-size: 24rpx;
        height: 110rpx;
        padding: 20rpx 0;
      }
    }
  }
  .right-sec{
    width: 50rpx;
    height: 50rpx;
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    margin-top: 12rpx;
    text{
      float: right;
    }
    // justify-content: flex-end;
  }
  .icon_location{
    width: 24rpx;
    height: 32rpx;
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
}
.input-inner {
    flex: 1;
    textarea {
      width: 90%;
      font-size: 24rpx;
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
