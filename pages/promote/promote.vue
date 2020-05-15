<template>
	<view class="container">
		<view class="header">
		  <text class="price">12312</text>
		  <text class="tip">可领取金额（元）</text>
      <button class="cu-btn withdraw">去提现</button>
		</view>
    <view class="money-section">
      <view class="money-item">
        <text class="l">累计收入</text>
        <view class="money-item-r">
          ￥12986.00
        </view>
      </view>
      <view class="money-item">
        <text class="l">已提现</text>
        <view class="money-item-r">
          ￥12986.00
        </view>
      </view>
      <view class="money-item">
        <text class="l">已消耗</text>
        <view class="money-item-r">
          ￥12986.00
        </view>
      </view>
      <view class="money-item">
        <text class="l">我的好友</text>
        <view class="money-item-r">
          {{friends}}
          <text class="cuIcon-right"></text>
        </view>
      </view>
    </view>
    <button class="s-bg-linear" :disabled="disabled" @click="_toPromoteDetail">去推广</button>
    <view class="notify">
      <text class="cuIcon-notificationfill"></text>
      <view class="msg">
        您有一笔提现申请，金额1000.00元。我们将尽快 为您审核！
      </view>
    </view>
	</view>
</template>

<script>
  import {mapState} from 'vuex';
	export default {
		data() {
			return {
				disabled:false,
        friends:0
			};
		},
    computed:{
      ...mapState(['token'])
    },
    onLoad() {
      this.directList()
    },
    methods: {
      _toPromoteDetail(){
        uni.navigateTo({
          url:'/pages/promote/to_promote'
        })
      },
      directList(){
        this.$http
          .post(`/api/agent/recommend/directList`,{
            token:this.token || uni.getStorageSync('state_token') 
          })
          .then(response => {
            const data = response.data;
            console.log(response)
            if (response.code == 1) {
              console.log('data',data.total)
              this.friends = data.total
            }
          });
      }
    }
	}
</script>

<style lang="scss" scoped>
  @import 'mixin.scss';
  page,.container{
    width: 100%;
    height: 100%;
    background-color: #fff;
    color: #333537;
    font-size: 30rpx;
  }
.container{
  .money-section{
    width: 100%;
    padding: 0 30rpx;
    .money-item{
      width: 100%;
      height: 100rpx;
      font-size: 30rpx;
      color: #333537;
      @include flexSB;
      border-bottom: 1px solid #E8E8E8;
    }
  }
  .s-bg-linear{
    width:680rpx;
    border-radius: 45rpx;
    margin-top: 72rpx;
    color: #fff;
  }
  .notify{
    width:688rpx;
    position: fixed;
    left: 31rpx;
    bottom: 50rpx;
    padding: 25rpx;
    background:rgba(253,244,205,1);
    border-radius:10rpx;
    color: #E17A31;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    .cuIcon-notificationfill{
      font-size: 28rpx;
      color: #E17A31;
    }
    .msg{
      margin-left: 15rpx;
      flex: 1;
    }
  }
  .header{
    width: 100%;
    height: 325rpx;
    background-image: url('https://cdn.swh296.com/img/yj/yj_t_bg2.png');
    background-size: 100% 100%;
    @include flexY;
    @include flexA;
    color: #fff;
    .price{
      font-size: 50rpx;
      margin-top: 80rpx;
    }
    .tip{
      font-size: 26rpx;
      margin: 10rpx auto 40rpx;
    }
    .withdraw{
      width:150rpx;
      height:50rpx;
      background:linear-gradient(-90deg,rgba(255,250,250,1) 0%,rgba(255,255,255,1) 100%);
      border-radius:25rpx;
      color: #F76868;
      font-size: 26rpx;
    }
  }
}
</style>
