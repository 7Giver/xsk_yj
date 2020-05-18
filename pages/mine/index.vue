<template>
  <view class="content">
    <view class="header" @click="_toOtherPage">
      <text class="cuIcon-settingsfill" @click="_toOtherPage('/pages/mine_comp/set')"></text>
      <view class="header-c">
        <view class="header-l">
          <image v-if="!userInfo.username" class="upic" :src="userInfo.avatar" mode=""></image>
          <image v-else class="upic" :src="userInfo.avatar_text" mode=""></image>
          <view class="info-msg">
            <text class="name">{{ userInfo.nickname || '点击登录' }}</text>
            <text class="phone">{{ userInfo.mobile }}</text>
          </view>
        </view>
        <view class="header-r">
          <view class="score">当前积分:--</view>
          <view class="sign-in" @click="developing">
            <image src="https://cdn.swh296.com/img/mine/icon_qiandao.png" mode=""></image>
            <text>签到领积分</text>
          </view>
        </view>
      </view>
      <view class="header-b" @click="developing">
        <view class="list">
          <view>
            <text class="num">--</text>
            <text>收藏夹</text>
          </view>
          <view>
            <text class="num">--</text>
            <text>关注店铺</text>
          </view>
          <view>
            <text class="num">--</text>
            <text>足迹</text>
          </view>
          <view @click.stop="_toOtherPage('/pages/mine_comp/coupon_list')">
            <text class="num">{{userInfo.count_redpack}}</text>
            <text>红包/卡券</text>
          </view>
        </view>
      </view>
    </view>
    <view class="type-section" @click="_toOtherPage(`/pages/mine_comp/order?id=0`)">
      <view class="order">
        <text>我的订单</text>
        <view>
          <text>全部订单</text>
          <text class="yticon icon-you"></text>
        </view>
      </view>
      <view class="order-list">
        <!-- <view class="item" v-for="(item, index) in orderList" @click="_toOrder(item.id)" :key="index"> -->
        <view class="item" v-for="(item, index) in orderList" @click="_toOtherPage(`/pages/mine_comp/order?id=${item.id}`)" :key="index">
          <image :src="item.src" mode=""></image>
          <text>{{ item.text }}</text>
        </view>
      </view>
    </view>
    <view class="splitCls"></view>
    <view class="info-section">
      <view class="item-list" @click="_toOtherPage(store.url)">
        <image class="icon-l" :src="store.src" mode=""></image>
        <view class="item-r">
          <text>{{ store.text }}</text>
          <text class="yticon icon-you"></text>
        </view>
      </view>
      <view class="item-list" @click="_toOtherPage(address.url)">
        <image class="icon-l" :src="address.src" mode=""></image>
        <view class="item-r">
          <text>{{ address.text }}</text>
          <text class="yticon icon-you"></text>
        </view>
      </view>
      <view class="item-list" v-if="userInfo.is_merchant != 1 && userInfo.shelves_switch == 1" @click="_toOtherPage(enter.url)">
      <!-- <view class="item-list"  @click="_toOtherPage(enter.url)"> -->
        <image class="icon-l" :src="enter.src" mode=""></image>
        <view class="item-r">
          <text>{{ enter.text }}</text>
          <text class="yticon icon-you"></text>
        </view>
      </view>
      <!-- <view class="item-list" @click="_toOtherPage(activity.url)"> -->
      <view class="item-list" @click="developing">
        <image class="icon-l" :src="activity.src" mode=""></image>
        <view class="item-r">
          <text>{{ activity.text }}</text>
          <text class="yticon icon-you"></text>
        </view>
      </view>
    </view>
    <view class="splitCls"></view>
    <!-- 订单 店铺 -->
    <view class="info-section bd">
      <view class="item-list" v-if="userInfo.is_merchant == 1" @click="_toOtherPage(selfStore.url)">
        <image class="icon-l" :src="selfStore.src" mode=""></image>
        <view class="item-r">
          <text>{{ selfStore.text }}</text>
          <text class="yticon icon-you"></text>
        </view>
      </view>
      <view class="item-list" v-if="userInfo.is_merchant == 1" @click="_toOtherPage(ordermanage.url)">
        <image class="icon-l" :src="ordermanage.src" mode=""></image>
        <view class="item-r">
          <text>{{ ordermanage.text }}</text>
          <text class="yticon icon-you"></text>
        </view>
      </view>
      <view class="item-list" v-if="userInfo.is_merchant == 1" @click="_toOtherPage(storemanage.url)">
        <image class="icon-l" :src="storemanage.src" mode=""></image>
        <view class="item-r">
          <text>{{ storemanage.text }}</text>
          <text class="yticon icon-you"></text>
        </view>
      </view>
    </view>
    <view class="info-section">
      <view class="item-list" v-if="userInfo.is_merchant == 1 && userInfo.is_promote == 1" @click="_toOtherPage(promotemanage.url)">
        <image class="icon-l" :src="promotemanage.src" mode=""></image>
        <view class="item-r">
          <text>{{ promotemanage.text }}</text>
          <text class="yticon icon-you"></text>
        </view>
      </view>
      <view class="item-list" @click="_toOtherPage(item.url)" v-for="(item, index) in typeList1" :key="index">
        <image class="icon-l" :src="item.src" mode=""></image>
        <view class="item-r">
          <text>{{ item.text }}</text>
          <text class="yticon icon-you"></text>
        </view>
      </view>
    </view>
    <view style="height:10px"></view>
    <!-- #ifdef H5 -->
    <view style="height: 50px;"></view>
    <!-- #endif -->
    <!--  -->
    <openAlert ref="openAlert" :IsBgShow="IsBgShow" :AlertClass="AlertClass" >
      <view class="coupon-inner">
        <image class="coupon-img" src="http://cdn.swh296.com/img/common/coupon_modal.png" mode=""></image>
        <view class="get" @shadeCloseTap="_hideSModal"></view>
        <text class="cuIcon-roundclose cu-icon" @click="_hideSModal('get')"></text>
      </view>
    </openAlert>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import sModal from '../../components/s_modal.vue';
export default {
  components: {
    sModal
  },
  data() {
    return {
      IsBgShow:false,
      AlertClass: 0,
      store: {
        src: 'https://cdn.swh296.com/img/mine/icon_yjb.png',
        text: '营家币商城',
        url: '/pages/yj/index'
      },
      address: {
        src: 'https://cdn.swh296.com/img/mine/icon_address.png',
        text: '收货地址',
        url: '/pages/address/address'
      },
      enter: {
        src: 'https://cdn.swh296.com/img/mine/icon_ruzhu.png',
        text: '个人小站',
        url: '/pages/merchant_enter1/merchant_enter'
      },
      activity: {
        src: 'https://cdn.swh296.com/img/mine/icon_huodong.png',
        text: '我的活动',
        url: ''
      },
      selfStore:{
        src: '/static/icon_selfstore.png',
        text: '我的店铺',
        url:'/pages/router-page/home'
      },
      ordermanage:{
          src: 'https://cdn.swh296.com/img/mine/icon_dingdan.png',
          text: '订单管理',
          url: `/pages/store_manage/home?page=manage-order`
      },
      storemanage:{
        src: 'https://cdn.swh296.com/img/mine/icon_dianpu.png',
        text: '店铺管理',
        url: '/pages/store_manage/home'
      },
      // 推广管理
      promotemanage:{
        src: 'https://cdn.swh296.com/img/mine/icon_manage.png',
        text: '推广管理',
        // url:'/pages/promote/promote'
        url:'/pages/promote/to_promote'
      },
      typeList2: [
        {
          src: 'https://cdn.swh296.com/img/mine/icon_dingdan.png',
          text: '订单管理',
          url: `/pages/store_manage/home?page=manage-order`
        },
        {
          src: 'https://cdn.swh296.com/img/mine/icon_dianpu.png',
          text: '店铺管理',
          url: '/pages/store_manage/home'
        }
      ],
      typeList1: [
        {
          src: 'https://cdn.swh296.com/img/mine/icon_advise.png',
          text: '投诉建议',
          url: '/pages/advise/advise'
        }
      ],
      orderList: [
        {
          src: 'https://cdn.swh296.com/img/mine/icon_pay.png',
          text: '待付款',
          id:1
        },
        {
          src: 'https://cdn.swh296.com/img/mine/icon_fahuo.png',
          text: '待发货',
          id:2
        },
        {
          src: 'https://cdn.swh296.com/img/mine/icon_card.png',
          text: '待收货',
          id:3
        },
        {
          src: 'https://cdn.swh296.com/img/mine/icon_pingjia.png',
          text: '待评价',
          id:4
        },
        {
          src: 'https://cdn.swh296.com/img/mine/icon_shouhou.png',
          text: '售后/退款',
          id:5
        }
      ],
      selfInfo: {
        nickName: '',
        avatarUrl: ''
      }
    };
  },
  computed: {
    ...mapState(['userInfo', 'token'])
  },
  onShow() {
    console.log('this.token',this.token)
    // #ifdef H5
    this.getUserInfo()
    // #endif
    // #ifdef MP-WEIXIN
    if(this.token) this.getUserInfo()
    // #endif
  },
  onLoad(options) {
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'setUserInfo',
      setToken: 'setToken',
      setStoreId: 'setStoreId',
    }),
    // _toOrder(url) {
    //   // uni.navigateTo({
    //   //   url: `/pages/mine_comp/order?id=${id}`
    //   // });
    //   uni.navigateTo({
    //     url:url
    //   })
    // },
    _hideSModal(text) {
      this.profile(text)
    },
    getUserInfo() {
      this.$http
        .post(`/api/user/getUserInfo`, {
          // token: this.token || uni.getStorageSync('state_token')
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            if (data.userinfo.coupon_notice == 1) {
              this.$nextTick(function() {
                this.AlertClass = 1;
                this.$nextTick(function() {
                  this.$refs.openAlert.Show();
                })
              })
            }
            this.setUserInfo(data.userinfo);
            this.setToken(data.userinfo.token);
          }
        });
    },
    profile(text) {
      this.$http
        .post(`/api/user/profile`, {
          token: this.token || uni.getStorageSync('state_token'),
          coupon_notice: 0
        })
        .then(response => {
          const data = response.data;
          console.log(response);
          if (response.code == 1) {
            this.setUserInfo(data.userinfo);
            this.setToken(data.userinfo.token);
            if (text == 'get') {
              this.$api.msg('恭喜您领取成功~');
            }
            this.$refs.openAlert.AlertShow=false
          } else {
            this.$api.msg(response.msg);
          }
        });
    },
    getselfInfo() {
      var _this = this;
      uni.getUserInfo({
        lang: 'zh_CN',
        success: function(res) {
          console.log('res', res.userInfo);
          _this.selfInfo = res.userInfo;
        }
      });
    },
    developing() {
      this.$api.msg('正在开发中...');
      return;
    },
    _toOtherPage(url) {
      var _this = this;
      if (this.userInfo.mobile) {
        if (url == '/pages/merchant_enter1/merchant_enter') {
          if (this.userInfo.store_id) {
            this.shopinfo(function(data) {
              let audit_status = data.store_info.audit_status;
              if (audit_status == 0) {
                _this.$api.msg('店铺审核中');
                return;
              } else {
                uni.navigateTo({
                  url: `/pages/merchant_enter1/audit?audit_status=${audit_status}`
                });
              }
            });
          } else {
            uni.navigateTo({
              url: url
            });
          }
        } else if (url === '/pages/advise/advise') {
          _this.$api.msg('正在开发中...');
          // uni.navigateTo({
          //   url:'/pages/login/login'
          // })
          return;
        } else {
          if(url=='/pages/router-page/home'){
            this.setStoreId(this.userInfo.store_id)
          }
          uni.navigateTo({
            url: url
          });
        }
      } else {
        uni.navigateTo({
          url: '/pages/login/login'
        });
      }
    },
    shopinfo(fn) {
      this.$http
        .post(`/api/merchants/openshop/info`, {
          token: this.token || uni.getStorageSync('state_token')
        })
        .then(response => {
          const data = response.data;
          console.log(response);
          if (response.code == 1) {
            typeof fn == 'function' && fn(data);
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .Alert-Content {
  .coupon-inner {
    width: 500rpx;
    height: 782rpx;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: 10%;
    z-index: 8;
    .coupon-img {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 4;
    }
    .get {
      width: 100%;
      height: 160rpx;
      position: absolute;
      bottom: 10%;
      left: 0;
      z-index: 5;
    }
    .cu-icon {
      font-size: 60rpx;
      position: absolute;
      bottom: -12%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9;
      color: #fff;
    }
  }
}
.couponModal {
  // width: 556rpx;
  width: 500rpx;
  // height: 869rpx;
  height: 782rpx;
  top: 10%;
  z-index: 8;
  .coupon-img {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 4;
  }
  .get {
    width: 100%;
    height: 80rpx;
    position: absolute;
    bottom: 10%;
    left: 0;
    z-index: 5;
  }
}
</style>
<style lang="scss" scoped>
@import 'mixin.scss';
page,
.content {
  background: #f7f4f8;
  height: 100%;
  .header {
    width: 750rpx;
    height: 466rpx;
    color: #ac883f;
    background: linear-gradient(-76deg, rgba(232, 195, 119, 1), rgba(244, 215, 156, 1));
    position: relative;
    overflow: hidden;
    .cuIcon-settingsfill {
      position: absolute;
      right: 30rpx;
      top: 40rpx;
      font-size: 42rpx;
      color: #333;
    }
    .header-c {
      width: 680rpx;
      @include flexSB;
      margin: 150rpx auto 0;
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
    .header-b {
      width: 100%;
      height: 148rpx;
      background-image: url('https://cdn.swh296.com/img/mine/header-b.png');
      background-size: 100% 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      color: #ffecd0;
      font-size: 30rpx;
      .list {
        width: 90%;
        margin: 0 auto;
        height: 100%;
        @include flexSA;
        view {
          flex: 0.8;
          @include flexY;
          @include flexJ;
          align-items: center;
          font-size: 26rpx;
          .num {
            font-size: 30rpx;
            margin-bottom: 12rpx;
          }
        }
      }
    }
  }
  .type-section {
    padding: 0 40rpx;
    background-color: #fff;
    margin: 0 auto;
    color: #333537;
    .order {
      @include flexSB;
      border-bottom: 1px solid #e8e8e8;
      font-size: 32rpx;
      height: 100rpx;
      > view {
        @include flexX;
        @include flexA;
        font-size: 30rpx;
        .icon {
          margin-left: 10rpx;
        }
      }
    }
    .order-list {
      width: 100%;
      height: 150rpx;
      @include flexSA;
      .item {
        flex: 1;
        @include flexY;
        @include flexJ;
        align-items: center;
        font-size: 26rpx;
        image {
          width: 44rpx;
          height: 44rpx;
          margin-bottom: 20rpx;
        }
        .num {
          font-size: 26rpx;
        }
      }
    }
  }
  .info-section {
    background-color: #fff;
    &.bd {
      .item-list {
        &:last-child {
          .item-r {
            border-bottom: 1px solid #e8e8e8;
          }
        }
      }
    }
    .item-list {
      width: 100%;
      height: 106rpx;
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
}
</style>
