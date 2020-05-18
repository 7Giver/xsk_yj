<template>
  <view class="s-container">
    <view class="tui-coupon-item tui-top20" v-for="(item, index) in couponData" :key="index">
      <view class="store-cover" @click="_toStore(item.store)">
        <image class="cover" :src="item.store.log_image_text" mode=""></image>
        <view class="tostore_text">进店</view>
      </view>
      <view class="center">
        <view class="center-t">
          <view class="price-inner">
            <text class="price" v-if="item.code == 0">￥{{ item.coupon.money }}</text>
            <text class="price" v-else>{{ item.coupon.name }}</text>
            <text class="cut" v-if="item.coupon.order_min_amount > 0">满{{ item.coupon.order_min_amount }}-{{ item.coupon.money }}</text>
          </view>
          <view class="type" v-if="item.code == 0">{{ item.coupon.desc }}</view>
          <view class="type" v-else>{{ item.coupon.exchange_name }}</view>
        </view>
        <!--  <view class="time">
          {{item.store.name}}
        </view> -->
        <view class="time">{{ item.coupon.use_start_time_text }} - {{ item.coupon.use_end_time_text }}</view>
      </view>
      <button class="s-bg-linear" @click="_getCode(item)" v-if="item.code != 0">验证二维码</button>
      <button class="s-bg-linear" @click="_toProduct(item)" v-else>去使用</button>
    </view>
    <s-modal v-if="isShowCodeModal" modalCls="codeModal" isIconClose="true" @_hideSModal="isShowCodeModal = false">
      <!-- <view class="codeModal"> -->
      <view class="title">验证二维码</view>
     <!-- <view class="copy">
        <text class="code">{{ code }}</text>
        <view @click="_copy">复制</view>
      </view> -->
      <!--  -->
      <view class="qrimg-i">
        <tki-qrcode
          cid="qrcode1"
          ref="qrcode"
          @tap="previewQrcode"
          :val="val"
          :size="size"
          :unit="unit"
          :icon="icon"
          :iconSize="iconsize"
          :lv="lv"
          :onval="onval"
          :loadMake="loadMake"
          :usingComponents="true"
          @result="qrR"
        />
      </view>
      <!--  -->
      <view class="content">
        <view class="item">有效期：{{ couponExchange.use_end_time_full }} 截止</view>
        <view class="item">兑换地址：{{ couponExchange.exchange_address }}</view>
        <view class="item">说明：二维码请不要告诉他人，此二维码为一次性使用性，即兑换使用后将失效。</view>
      </view>
      <!-- </view> -->
    </s-modal>
    <empty setSrc="https://cdn.swh296.com/img/common/empty_content.png" v-if="loaded === true && couponData.length === 0"><view class="empty-text">暂无可用优惠券</view></empty>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import empty from '@/components/empty';
import sModal from '../../components/s_modal.vue';
export default {
  components: {
    sModal,
    empty
  },
  data() {
    return {
      couponData: [],
      isShowCodeModal: false,
      couponExchange: {},
      code: '',
      loaded: false,
      // 
      val: '', // 要生成的二维码值
      size: 220, // 二维码大小
      unit: 'upx', // 单位
      background: '#b4e9e2', // 背景色
      foreground: '#309286', // 前景色
      pdground: '#32dbc6', // 角标色
      icon: '', // 二维码图标
      iconsize: 20, // 二维码图标大小
      lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
      onval: false, // val值变化时自动重新生成二维码
      loadMake: true, // 组件加载完成后自动生成二维码
      src: '' // 二维码生成后的图片地址或base64
      // 
    };
  },
  onLoad() {
    this.couponlist()
  },
  computed: {
    ...mapState(['token','userInfo'])
  },
  methods: {
    ...mapMutations({
      setStoreId: 'setStoreId'
    }),
    qrR(res) {
    	this.src = res 
    },
    _toStore(store) {
      this.setStoreId(store.id);
      uni.navigateTo({
        url: `/pages/router-page/home`
      });
    },
    _toProduct(item) {
      this.setStoreId(item.store.id);
      uni.navigateTo({
        url: `/pages/router-page/home`
      });
    },
    _copy() {
      uni.setClipboardData({
        data: this.code,
        success: function() {
          uni.getClipboardData({
            success: function(res) {
              console.log(res.data);
            }
          });
        }
      });
    },
    _getCode(item) {
      this.couponExchange = item.coupon;
      this.code = item.code;
      this.val = this.$baseURL + `/api/merchants/coupon/qrcode/${item.coupon.id}/code/${item.code}`
      console.log(this.val)
      // this.couponData = item
      this.isShowCodeModal = true;
    },
    //优惠券列表
    couponlist() {
      this.$http
        .post(`/addons/xshopcoupon/coupon/list`, {
          token: this.token || uni.getStorageSync('state_token'),
          type: 1
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            console.log('data', data);
            this.loaded = true;
            this.couponData = data;
          }
        });
    }
    // getSignUrl: function(index) {
    //   let url = '';
    //   if (index === 1) {
    //     url = 'https://www.thorui.cn/wx/static/images/mall/coupon/img_couponcentre_received_3x.png';
    //   } else if (index == 3) {
    //     url = 'https://www.thorui.cn/wx/static/images/mall/coupon/img_coupon_beused_3x.png';
    //   } else if (index == 4) {
    //     url = 'https://www.thorui.cn/wx/static/images/mall/coupon/img_coupon_failure_3x.png';
    //   }
    //   return url;
    // }
  }
};
</script>

<style lang="scss" scoped>
@import 'mixin.scss';
page {
  background: #f5f5f5;
}
/deep/.tki-qrcode{
  margin: 20rpx auto 0;
  display: flex;
  justify-content: center;
}
/deep/.codeModal {
  width: 520rpx;
  padding: 45rpx 32rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 10rpx;
  color: #999999;
  font-size: 26rpx;
  z-index: 8;
  top: 24%;
  .title {
    width: 100%;
    text-align: center;
    color: #333537;
    font-size: 36rpx;
  }
  .copy {
    margin-top: 30rpx;
    color: #4287e4;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    .code {
      color: #f15f47;
      font-size: 30rpx;
    }
    view {
      margin-left: 30rpx;
    }
  }
  .content {
    .item {
      margin-top: 25rpx;
    }
  }
}

.tui-coupon-list {
  width: 100%;
  padding: 0 25rpx;
  box-sizing: border-box;
}
.tui-coupon-item {
  width: 688rpx;
  padding: 0 20rpx;
  margin: 20rpx auto 0;
  height: 178rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 24rpx;
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  .s-bg-linear {
    position: absolute;
    right: 20rpx;
    bottom: 40rpx;
    width: 140rpx;
    height: 54rpx;
    border-radius: 27rpx;
    color: #fff;
    font-size: 22rpx;
    padding: 0;
  }
  .store-cover {
    width: 126rpx;
    height: 126rpx;
    border-radius: 14rpx;
    position: relative;
    margin-right: 15rpx;
    .cover {
      width: 126rpx;
      height: 126rpx;
      border-radius: 14rpx;
    }
    .tostore_text {
      position: absolute;
      width: 100%;
      height: 40rpx;
      background: rgba(0, 0, 0, 0.5);
      line-height: 40rpx;
      text-align: center;
      left: 0;
      bottom: 0;
      font-size: 26rpx;
      color: #fff;
      border-radius: 0 0 14rpx 14rpx;
    }
  }
  .center {
    flex: 1;
    height: 126rpx;
    @include flexY;
    justify-content: space-between;
    .center-t {
      color: #f64443;
      font-size: 22rpx;
      @include flexY;
      .price-inner {
        font-size: 32rpx;
        .price {
          margin-right: 9rpx;
        }
        .cut {
          font-size: 22rpx;
        }
      }
      .type {
        margin-top: 12rpx;
        color: #666666;
        font-size: 24rpx;
      }
    }
    // .store
    .time {
      color: #999999;
      font-size: 20rpx;
    }
  }
}
</style>
