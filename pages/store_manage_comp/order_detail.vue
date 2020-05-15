<template>
  <view class="container">
    <view class="sec">
      <view class="order-section">
        <view class="item">
          <view class="item-l">
            <text class="tip">订单号：</text>
            <text>{{goodsItem.order_sn}}</text>
          </view>
          <view class="item-r" :class="isTextCls">{{goodsItem.state_tip}}</view>
        </view>
        <view class="item">
          <view class="item-l">
            <text class="tip">下单日期：</text>
            <text>{{goodsItem.create_time_text}}</text>
          </view>
        </view>
        <view class="item">
          <view class="item-l">
            <text class="tip">订单金额：</text>
            <text class="price">￥{{goodsItem.products_price}}</text>
          </view>
        </view>
      </view>
      <view class="goods" v-for="(item,index) in goodsItem.products" :key="index">
        <image class="goods-img" :src="item.images_text[0]" mode="aspectFill"></image>
        <view class="center">
          <text class="title clamp">{{ item.title }}</text>
          <text class="attr-box">规格:{{ item.attributes }}</text>
        </view>
        <view class="right">
          <text class="price">{{ item.product_price }}</text>
          <text class="num">x{{ item.quantity }}</text>
        </view>
      </view>
      <!--  -->
      <view class="order-section">
        <view class="item">
          <view class="item-l">
            <text class="tip">客户姓名：</text>
            <text>{{goodsItem.contactor}}</text>
          </view>
        </view>
        <view class="item">
          <view class="item-l">
            <text class="tip">联系电话：</text>
            <text>{{goodsItem.contactor_phone}}</text>
          </view>
        </view>
        <view class="item" v-if="goodsItem.address">
          <view class="item-l">
            <text class="tip">联系地址：</text>
            <text class="address">{{goodsItem.address}}</text>
          </view>
        </view>
        <view class="item" v-if="goodsItem.remark">
          <view class="item-l">
            <text class="tip">备注：</text>
            <text class="address">{{goodsItem.remark}}</text>
          </view>
        </view>
       <view class="item" v-if="goodsItem.express_code">
          <view class="item-l">
            <text class="tip">快递公司：</text>
            <text class="address">{{goodsItem.express_code}}</text>
          </view>
        </view>
        <view class="item" v-if="goodsItem.express_no">
          <view class="item-l">
            <text class="tip">快递单号：</text>
            <text class="address">{{goodsItem.express_no}}</text>
          </view>
        </view>
        <!-- 售后原因 -->
        <view class="item" v-if="goodsItem.after_why">
          <view class="item-l">
            <text class="tip">售后原因：</text>
            <text class="address">{{goodsItem.after_why}}</text>
          </view>
        </view>
        <!-- 已支付 未发货 -->
        <view class="item bt" v-if="goodsItem.status == '6'">
        <!--<view class="item-l">
              <text class="tip">快递公司：</text>
              <view class="picker-section">
                <picker @change="bindPickerChange" :value="index" :range="array">
                  <view class="uni-input">{{ array[index] }}</view>
                </picker>
              </view>
            </view> -->
          <view class="item-l">
            <text class="tip">快递单号：</text>
            <input type="text" class="input-section" v-model="orderNumber" value="" />
          </view>
        </view>
        <!-- 已支付待收货 -->
        <view class="item bt" v-if="goodsItem.status == '7'">
          <view class="item-l">
            <text class="tip">快递单号：</text>
            <view class="copy-section"  v-if="goodsItem.express_no"><text>{{goodsItem.express_no}}</text><text class="copy" @click="_copy">复制</text></view>
          </view>
        </view>
      </view>
    </view>
    <!-- 售后中 -->
    <view class="btn-section"  v-if="goodsItem.status == '3'"><button class="cu-btn round" :disabled="isDisabled" @click="_saleDown">售后完成</button></view>
    <!-- 已支付 未发货 -->
    <view class="btn-section" v-if="goodsItem.status == '6'"><button class="cu-btn round" :disabled="isDisabled" @click="_confirm">确认发货</button></view>
  </view>
</template>

<script>
import {mapState} from 'vuex';
export default {
  data() {
    return {
      goodsItem:{},
      orderNumber: '',
      array: ['中国', '美国', '巴西', '日本'],
      index: -1,
      order_id:'',
      isDisabled:false
    };
  },
  computed: {
    isTextCls() {
      return this.goodsItem.active === '待发货' ? 'dfh' : 'dfh';
    },
    ...mapState(['token'])
  },
  onLoad(options) {
    this.order_id = options.id
    this.details(options.id)
  },
  methods: {
    details(id){
      this.$http
        .post(`/api/merchants/Order/details`,{
          token:this.token,
          id:id,
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            console.log('response',data)
            this.goodsItem = data
          }
        })
    },
    shipping(){
      this.isDisabled = true
      this.$http
        .post(`/api/merchants/Order/shipping`,{
          token:this.token,
          id:this.order_id,
          num:this.orderNumber
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            this.isDisabled = false
            this.$api.msg(response.msg)
            setTimeout(()=>{
              uni.navigateBack()
            },300)
            console.log('response',data)
          }else{
            this.isDisabled = false
          }
        })
    },
    closeAfterService(){
      this.isDisabled = true
      this.$http
        .post(`/api/merchants/Order/closeAfterService`,{
          token:this.token,
          id:this.order_id,
          remark:''
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            this.isDisabled = false
            this.$api.msg(response.msg)
            setTimeout(()=>{
              uni.navigateBack()
            },300)
            console.log('response',data)
          }else{
            this.isDisabled = false
          }
        })
    }, 
    _copy(){
     // #ifdef MP-WEIXIN
     uni.setClipboardData({
         data: this.goodsItem.order,
         success: function () {
             uni.getClipboardData({
                 success: function (res) {
                     console.log(res.data);
                 }
             });
         }
     });
     // #endif
    },
    _confirm() {
      this.shipping()
    },
    _saleDown(){
      this.closeAfterService()
    },
    bindPickerChange(e) {
      console.log('picker发送选择改变，携带值为', e.target.value);
      this.index = e.target.value;
    }
  }
};
</script>

<style lang="scss">
@import 'mixin.scss';
.sec {
  padding: 0 32rpx 130rpx;
  color: #333537;
  font-size: 26rpx;
  .order-section {
    padding: 40rpx 0;
    .item {
      width: 100%;
      line-height: 50rpx;
      @include flexSB;
      &.bt {
        margin-bottom: 20rpx;
      }
      .item-l {
        // @include flexX;
        display: flex;
        .tip {
          display: inline-block;
          width: 150rpx;
          text-align-last: justify;
          margin-right: 10rpx;
        }
        .address {
          flex: 1;
        }
        .input-section,
        .picker-section {
          width: 280rpx;
          height: 54rpx;
          background: rgba(255, 255, 255, 0);
          border: 1px solid rgba(206, 206, 206, 1);
          border-radius: 6rpx;
          font-size: 26rpx;
          input {
            font-size: 26rpx;
            width: 100%;
            height: 100%;
          }
          picker {
            width: 100%;
            height: 100%;
          }
        }
        .copy-section{
          .copy{
            color: #F26A53;
            margin-left: 80rpx;
          }
        }
      }
      .item-r {
        &.dfh {
          color: #fe8619;
        }
      }
    }
  }
}
.goods {
  display: flex;
  padding: 25rpx 20rpx;
  background-color: #fafafa;
  @include flexX;
  .goods-img {
    display: block;
    width: 128rpx;
    height: 128rpx;
    border-radius: 5rpx;
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
    text-align: right;
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
.btn-section {
  width: 100%;
  border-top: 1px solid #dddddd;
  height: 120rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 3;
  background-color: #fff;
  .cu-btn {
    width: 90%;
    left: 5%;
    background: linear-gradient(-90deg, rgba(242, 106, 83, 1) 0%, rgba(238, 67, 39, 1) 100%);
    height: 90rpx;
    margin-top: 15rpx;
    border-radius: 45rpx;
    color: #fff;
    font-size: 34rpx;
  }
}
</style>
