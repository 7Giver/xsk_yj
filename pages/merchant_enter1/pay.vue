<template>
  <view class="container">
    <view class="store-info">
      <image class="cover" v-if="store_info.log_image_text" :src="store_info.log_image_text" mode=""></image>
      <text>{{store_info.name}}</text>
    </view>
    <view class="ser-money">
      <view class="ser-item">
        <text>保证金</text>
        <text>20000元</text>
      </view>
      <text class="cuIcon-"></text>
      <view class="ser-item">
        <text>服务费</text>
        <text>10000元</text>
      </view>
    </view>
    <view class="total">共计: 30000元</view>
    <button class="cu-btn" :disabled="disabled" :loading="loading" @click="submit">立即支付</button>
    <view class="tip">付费支付后不支持退款</view>
    <image class="power" src="https://cdn.swh296.com/img/pay/merchant_power.png" mode=""></image>
  </view>
</template>

<script>
  import {mapState} from 'vuex';
  import {requestPayment} from '../../common/js/commonInfo.js'
  export default{
    data() {
      return {
        loading:false,
        disabled:false,
        store_info:{},
        order_sn:''
      }
    },
    computed:{
      ...mapState(['token'])
    },
    onLoad() {
      this.info()
    },
    methods: {
      submit(){
        this.pay()
      },
      info(){
        this.$http
          .post(`/api/merchants/openshop/info`,{
            token:this.token
          } )
          .then(response => {
            const data = response.data;
            console.log('data', data);
            if (response.code == 1) {
              this.store_info = data.store_info
              this.prepay()
            }
          })
      },
      prepay(){
        this.$http
          .post(`/api/merchants/openshop/prepay`,{
            type:3,
            token:this.token,
            id:this.store_info.id
          } )
          .then(response => {
            const data = response.data;
            console.log('data', data);
            if (response.code == 1) {
              this.order_sn = data.order_sn
            }
          })
      },
     pay(){
     this.loading =true
     this.disabled =true
      this.$http
        .post(`/addons/epay/store/pay`,{
          order_sn:this.order_sn
        } )
        .then(response => {
          const data = response.data;
          console.log('data', data);
          if (response.code == 1) {
            requestPayment.call(this,data,function(res){
              uni.switchTab({
                 url:'/pages/mine/index'
              })
            })
          }else{
            this.$api.msg(response.msg)
          }
        })
    }
    }
  }
</script>

<style lang="scss" scoped>
@import 'mixin.scss';
page,.container{
  width: 100%;
  background-color: #fff;
  padding-top: 20rpx;
}
.container{
  height: 100%;
  color: #fff;
  font-size: 40rpx;
  @include flexY;
  @include flexA;
  @include flexJ;
  .store-info{
    width:690rpx;
    height:110rpx;
    background:rgba(255,255,255,1);
    border:1px solid rgba(227, 226, 225, 1);
    border-radius:14rpx;
    font-size: 28rpx;
    color: #333;
    @include flexX;
    @include flexA;
    .cover{
      width:120rpx;
      height:60rpx;
      margin:  0 30rpx 0 20rpx;
    }
  }
  .ser-money{
    margin-top: 50rpx;
    width: 580rpx;
    height: 260rpx;
    background-image: url('https://cdn.swh296.com/img/pay/merchant_bg.png');
    background-size: 100% 100%;
    @include flexSA;
    .ser-item{
      @include flexY;
      @include flexA;
      text{
        margin-bottom: 15rpx;
      }
    }
  }
  .total{
    width: 580rpx;
    text-align: left;
    color: #F64443;
    font-size: 30rpx;
    margin-top: 20rpx;
  }
  .cu-btn{
    width:600rpx;
    height:90rpx;
    margin-top: 65rpx;
    background:linear-gradient(-90deg,rgba(242,106,83,1) 0%,rgba(238,67,39,1) 100%);
    border-radius:45rpx;
    color: #fff;
    font-size: 34rpx;
  }
  .tip{
    margin-top: 30rpx;
    color: #999999;
    font-size: 26rpx;
  }
  .power{
    margin-top: 70rpx;
    width: 690rpx;
    height: 345rpx;
  }
}
</style>
