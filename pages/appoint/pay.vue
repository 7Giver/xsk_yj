<template>
  <view class="container">
    <image class="pay_img1" src="https://cdn.swh296.com/img/appoint/pay_img1.png" mode=""></image>
    <image class="pay_img2" src="https://cdn.swh296.com/img/appoint/pay_img2.png" mode=""></image>
    <view class="meal-section">
      <view class="meal-item " :class="{'active' : meal_id == '1'}" @click="_choose('year')">
        <view class="meal-text">
          年卡套餐
        </view>
        <view class="item-r">
          <view class="day">
            <text class="price">￥300</text>
            <text>/365天</text>
          </view>
        </view>
      </view>
      <view class="meal-item" :class="{'active' : meal_id == '2'}" @click="_choose('time')">
        <view class="meal-text">
          次数套餐
        </view>
        <view class="item-r">
          <view class="day">
            <text class="price">￥5</text>
            <text>/次</text>
          </view>
            <!-- :isMax="sitem.quantity >= sitem.sku.stock ? true : false" -->
            <!-- :max="sitem.sku.stock" -->
            <view>
              <uni-number-box
                class="step"
                :min="1"
                :productId='productId'
                :value="time_meal"
                :isMin="time_meal == 1"
                @eventChange="numberChange"
              ></uni-number-box>
            </view>
        </view>
      </view>
    </view>
    <view style="height:55px">
      
    </view>
    <!-- 底部 -->
    <view class="footer">
      <view class="price-content">
        <text>实付款</text>
        <text class="price-tip">￥</text>
        <text class="price">{{order_price}}</text>
      </view>
      <!-- <text class="submit" @click="submit">提交订单</text> -->
      <button class="cu-btn submit" :disabled="disabled" @click="submit">立即支付</button>
    </view>
  </view>
</template>

<script>
  const yearPrice = 300
  const timePrice = 5
  import uniNumberBox from '@/components/uni-number-box.vue';
  export default {
    data(){
      return {
        disabled:false,
        meal_id:1,
        time_meal:1,
        productId:0,
        order_price:yearPrice,
        time_price:timePrice,
        type:'member',
        quantity:1
      }
    },
    components:{
      uniNumberBox
    },
    methods:{
      openMember(){
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
          .post(`/addons/microlife/member/add`,{
            quantity:this.quantity,
            type:this.type,
            method:method
          })
          .then(response => {
            this.disabled = false
            const data = response.data
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
          });
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
      numberChange(data) {
        this.quantity = data.number || 1
        this.order_price = this.time_price =  data.number * 5
      },
      submit(){
        this.disabled = true
        this.openMember()
      },
      _choose(text){
        if(text == 'year'){
          this.meal_id = 1 
          this.type = 'member'
          this.order_price = yearPrice
        }else{
          this.meal_id = 2
          this.type = 'coupon'
          this.order_price = this.time_price
        }
      }
    }
  }
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
    margin-left: 25rpx;
    position: relative;
    border: none;
  }
  page,.container{
    background:linear-gradient(0deg,rgba(253,239,227,1),#FDF1E6);
    .pay_img1{
      width: 100%;
      height: 461rpx;
    }
    .pay_img2{
      width: 100%;
      height: 280rpx;
    }
    .meal-section{
      margin-top: -8rpx;
      padding-top:20rpx;
      background:linear-gradient(0deg,rgba(253,239,227,1),#FDF1E6);
      .meal-item{
        width:690rpx;
        background-color: #fff;
        margin: 0 auto 20rpx;
        padding: 0 35rpx;
        height:110rpx;
        border-radius:6rpx;
        @include flexSB;
        font-size: 32rpx;
        color: #131A31;
        &.active{
          border:2rpx solid rgba(242, 172, 128, 1);
          background:#F2AC80;
          /deep/.uni-numbox{
            background:#F2AC80;
          }
        }
        .item-r{
          @include flexX;
          justify-content:right;
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
  }
</style>
