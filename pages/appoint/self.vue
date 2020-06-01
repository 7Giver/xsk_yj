<template>
  <view class="conatainer">
    <view class="header">
        <view class="header-l">
          <image class="upic" :src="userInfo.avatar_text" mode=""></image>
          <view class="info-msg">
            <text class="name">{{ userInfo.nickname || '点击登录' }}</text>
            <text class="phone">{{ userInfo.mobile }}</text>
          </view>
        </view>
    </view>
    <navigator url="./pay">
      <view class="kt-section">
        <button type="default" class="cu-btn">立即开通</button>
      </view>
    </navigator>
    <view class="info-section">
      <view class="item-list" v-for="(item,index) in list" :key="index" @click="_toOtherPage(item)">
        <image class="icon-l" :src="item.src" mode=""></image>
        <view class="item-r">
          <text>{{ item.text }}</text>
          <text class="yticon icon-you"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState,mapMutations } from 'vuex';
export default {
  data() {
    return {
      list:[
        {
          src: 'https://cdn.swh296.com/img/appoint/mine_icon_yh.png',
          text: '我的优惠',
          url: '/pages/yj/index'
        },
        {
          src: 'https://cdn.swh296.com/img/appoint/mine_icon_address.png',
          text: '收货地址',
          url: '/pages/address/address'
        },
        {
          src: 'https://cdn.swh296.com/img/appoint/mine_icon_kf.png',
          text: '我的客服',
          url: '/pages/yj/index'
        }
      ]
    }
  },
  computed: {
    ...mapState(['userInfo', 'token'])
  },
  mounted() {
    console.log(this.userInfo.nickname)
    if(!this.userInfo.nickname){
       this.setUserInfo(uni.getStorageSync('state_userInfo'))
    }
  },
  methods:{
    ...mapMutations({
      setUserInfo: 'setUserInfo',
    }),
    _toOtherPage(item) {
      let url = item.url
      uni.navigateTo({
        url:url
      })
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'mixin.scss';
page,.container{
  background-color: #F7F9FB;
}
.kt-section{
  width:696rpx;
  margin: 0 auto 45rpx;
  height: 91rpx;
  line-height: 91rpx;
  background-image: url('https://cdn.swh296.com/img/appoint/mine_img.png');
  background-size: 100% 100%;
  button{
    float: right;
    width:114rpx;
    height:45rpx;
    background:linear-gradient(90deg,rgba(247,83,71,1),rgba(251,73,85,1));
    border-radius:22rpx;
    font-size: 20rpx;
    padding: 0;
    margin: 23rpx 30rpx 0;
    color: #fff;
  }
}
.header {
    // width: 100rpx;
    padding-left: 50rpx;
    height: 180rpx;
    @include flexSB;
    // margin: 150rpx auto 0;
    .header-l {
      margin-top: 15rpx;
      @include flexX;
      @include flexA;
      .upic {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50rpx;
        margin-right: 20rpx;
      }
      .info-msg {
        @include flexY;
        font-size: 34rpx;
        .phone {
          font-size: 26rpx;
          margin-top: 12rpx;
        }
      }
    }
    .header-r {
      @include flexY;
      @include flexJ;
      .score {
        font-size: 24rpx;
        text-align: center;
        margin-bottom: 12rpx;
      }
      .sign-in {
        padding: 0 10rpx;
        height: 58rpx;
        @include flexX;
        @include flexA;
        background: rgba(190, 152, 76, 1);
        border: 1px solid rgba(217, 180, 103, 1);
        border-radius: 29rpx;
        font-size: 24rpx;
        color: #fff;
        image {
          width: 28rpx;
          height: 30rpx;
          margin-right: 5rpx;
        }
      }
    }
}
  .info-section {
    margin: 0 32rpx;
    background-color: #fff;
    .item-list {
      width: 100%;
      height: 106rpx;
      background-color: #fff;
      @include flexX;
      @include flexA;
      color: #333333;
      .icon-l {
        width: 48rpx;
        height: 48rpx;
        margin: 0 30rpx 0 34rpx;
      }
      .item-r {
        height: 100%;
        flex: 1;
        @include flexSB;
        margin-right: 40rpx;
        border-bottom: 1px solid #e8e8e8;
        .icon-you {
        }
      }
      &:last-child {
        .item-r {
          border-bottom: none;
        }
      }
    }
  }
</style>
