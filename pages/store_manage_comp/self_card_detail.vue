<template>
  <view class="container">
    <view class="self-coupon">
      <!-- <image :src="couponDetail.detail" mode=""></image> -->
      <!-- <image :src="getCouponImage(couponDetail.type)" mode=""></image> -->
      <image :src="couponImage" mode=""></image>
      <view class="num">
        <text class="num-l">{{ couponDetail.desc }}</text>
        <text class="num-r">数量: {{ couponDetail.count }}</text>
      </view>
      <view class="detail">
        <view class="detail-l">
          <text>{{ couponDetail.name }}</text>
          <text class="time">有效期: {{ couponDetail.use_start_time_text }} 至 {{ couponDetail.use_end_time_text }}</text>
        </view>
        <view class="detail-r">
          <view class="user-btn" v-if="couponDetail.home_display == 0" @click.stop="isuserModal = true">指定用户>></view>
          <button class="validate-btn" v-if="couponDetail.type == 4" @click.stop="validateBtn">秘钥</button>
        </view>
      </view>
    </view>
    <view class="enough_bg">
      <view class="item">
        <text class="num">{{ couponDetail.already_text }}</text>
        <text>领取数量</text>
      </view>
      <view class="item">
        <text class="num">{{ couponDetail.canget }}</text>
        <text>剩余数量</text>
      </view>
    </view>
    <view class="tab">
      <view class="tab-item" v-for="(item, index) in tabList" @click="switchTab(item)" :class="{ active: item.id == tabId }" :key="index">{{ item.text }}</view>
    </view>
    <view class="splitCls"></view>
    <view class="detail-section" v-if="couponList.length > 0">
      <view class="item" v-for="(item, index) in couponList" :key="index">
        <text class="item-l">{{ item.user.nickname }}</text>
        <view class="item-r" v-if="item.use_time">使用时间：{{ item.use_time_text }}</view>
        <view class="item-r" v-else>领取时间：{{ item.create_time_text }}</view>
      </view>
    </view>
    <empty setSrc="https://cdn.swh296.com/img/common/empty_content.png" isTop="62%" v-if="loaded === true && couponList.length === 0">
      <view class="empty-text">暂无数据</view>
    </empty>
    <view class="bt-section">
      <button class="cu-btn" :disabled="disabled" @click="_stop">{{ isgrant_text }}</button>
    </view>
    <tui-modal :show="iscodeModal" @cancel="hidecodeModal" :custom="true" :fadein="true">
      <view class="tui-modal-custom" v-if="iscodeModal">
        <view class="tui-item">
          <view class="tui-prompt-title">输入客户秘钥验证码</view>
          <input placeholder="请输入秘钥" maxlength="10" @input="inputValidate" class="tui-input" v-model="validateCode" />
        </view>
        <tui-button shape="circle" type="danger" @click="_submitcodeInfo">确定</tui-button>
      </view>
    </tui-modal>
    <tui-modal :show="isuserModal" @cancel="hideuserModal" :custom="true" :fadein="true">
      <view class="tui-modal-custom" v-if="isuserModal">
        <view class="tui-item">
          <view class="tui-prompt-title">指定账号</view>
          <input placeholder="请输入用户账号" maxlength="11" type="number" class="tui-input" v-model="userCode" />
        </view>
        <tui-button shape="circle" type="danger" @click="_submituserInfo">确定</tui-button>
      </view>
    </tui-modal>
  </view>
</template>

<script>
import { mapState } from 'vuex';
import empty from '@/components/empty';
import tuiButton from '@/components/ThorUI/button/button';
import tuiModal from '@/components/ThorUI/modal/modal';
export default {
  components: {
    empty,
    tuiButton,
    tuiModal
  },
  data() {
    return {
      tabList: [
        {
          text: '领取详情',
          id: 0
        },
        {
          text: '使用详情',
          id: 1
        }
      ],
      tabId: 0,
      option_id: '',
      couponList: [],
      couponDetail: {},
      loaded: false,
      page: 1,
      isgrant_text: '', //是否发放
      disabled: false,
      iscodeModal: false,
      validateCode: '', //秘钥
      isuserModal: false,
      userCode: '',
      isOk: false,
      couponImage: ''
    };
  },
  computed: {
    ...mapState(['token'])
  },
  onLoad(options) {
    this.option_id = options.id;
    this.details();
    this.detailsList();
  },
  methods: {
    validateBtn() {
      this.iscodeModal = true;
    },
    inputValidate(e) {
      let value = e.detail.value;
      if (e.detail.value.trim().length == 10) {
        this.validateCode = value;
        this.valiCode();
      }
    },
    hidecodeModal() {
      this.iscodeModal = false;
    },
    hideuserModal() {
      this.isuserModal = false;
    },
    _submituserInfo() {
      if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.userCode)) {
        this.$api.msg('请输入正确的账号~');
        return;
      }
      this.giveAs();
    },
    _submitcodeInfo() {
      if (this.isOk) {
        this.useCode();
      } else {
        this.$api.msg('请输入正确的秘钥');
      }
    },
    useCode() {
      this.$http
        .post(`/api/merchants/coupon/useCode`, {
          token: this.token,
          code: this.validateCode
        })
        .then(response => {
          const data = response.data;
          this.$api.msg(response.msg);
          if (response.code === 1) {
            this.iscodeModal = false;
          }
        });
    },
    valiCode() {
      this.$http
        .post(`/api/merchants/coupon/valiCode`, {
          token: this.token,
          code: this.validateCode
        })
        .then(response => {
          const data = response.data;
          this.$api.msg(response.msg);
          if (response.code === 1) {
            this.isOk = true;
          } else {
            this.isOk = false;
          }
        });
    },
    _stop() {
      this.disabled = true;
      let status = this.couponDetail.status == 1 ? 0 : 1;
      this.$http
        .post(`/api/merchants/coupon/update`, {
          token: this.token,
          id: this.option_id,
          status: status
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            this.$api.msg(response.msg);
            this.isgrant_text = this.isgrant_text == '发放' ? '停止发放' : '发放';
            this.couponDetail.status = this.couponDetail.status == 1 ? 0 : 1;
            this.disabled = false;
            console.log('data', data);
          } else {
            this.disabled = false;
          }
        });
    },
    details() {
      this.$http
        .post(`/api/merchants/coupon/details`, {
          token: this.token,
          id: this.option_id
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            this.couponDetail = data;
            console.log('data', data.type);
            if (data.type == 3) {
              this.couponImage = 'http://cdn.swh296.com/img/store-manage/coupon_youhui.png';
            } else if (data.type == 4) {
              this.couponImage = 'http://cdn.swh296.com/img/store-manage/coupon_store.png';
            } else {
              this.couponImage = 'http://cdn.swh296.com/img/store-manage/coupon_cut.png';
            }
            this.isgrant_text = data.status == 1 ? '停止发放' : '发放';
          }
        });
    },
    giveAs() {
      this.$http
        .post(`/addons/xshopcoupon/coupon/giveAs`, {
          token: this.token,
          id: this.couponDetail.id,
          mobile: this.userCode
        })
        .then(response => {
          this.$api.msg(response.msg);
          if (response.code === 1) {
          } else {
          }
        });
    },
    detailsList() {
      this.$http
        .post(`/api/merchants/coupon/detailsList`, {
          token: this.token,
          id: this.option_id,
          use_status: this.tabId,
          page: this.page
        })
        .then(response => {
          const data = response.data.data;
          if (response.code === 1) {
            uni.hideLoading();
            this.loaded = true;
            this.couponList = data;
            console.log('data', data);
          }
        });
    },
    switchTab(item) {
      this.tabId = item.id;
      this.couponList = [];
      this.loaded = false;
      uni.showLoading({
        title: '加载中...'
      });
      this.detailsList();
    }
  }
};
</script>
<style lang="scss">
page,
.container {
  height: 100%;
}
</style>
<style lang="scss" scoped>
@import 'mixin.scss';
/deep/.tui-modal-box {
  padding: 0 !important;
}
page,
.container {
  background-color: #fff;
  height: 100%;
}
.container {
  width: 100%;
  padding-top: 40rpx;
  .tui-modal-custom,
  .tui-modal-custom1 {
    text-align: center;
    margin: 20px 32px;
  }

  .tui-prompt-title {
    text-align: center;
    padding-bottom: 20rpx;
    font-size: 34rpx;
  }
  .tui-input {
    margin: 30rpx 0rpx;
    border-bottom: 1rpx solid #e6e6e6;
    padding-bottom: 20rpx;
    text-align: center;
  }
  .self-coupon {
    width: 648rpx;
    height: 333rpx;
    margin: 0 auto -30rpx;
    position: relative;
    overflow: hidden;
    color: #fff;
    image {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
    .num {
      width: 80%;
      margin: 50rpx auto;
      position: relative;
      @include flexSB;
      .num-l {
        font-size: 40rpx;
      }
      .num-r {
        font-size: 28rpx;
      }
    }
    .detail {
      width: 80%;
      margin: 60rpx auto 0;
      position: relative;
      @include flexSB;
      .detail-l {
        font-size: 34rpx;
        @include flexY;
        .time {
          margin-top: 10rpx;
          font-size: 20rpx;
        }
      }
      .detail-r {
        margin-top: -22rpx;
        @include flexY;
        .validate-btn,
        .user-btn {
          height: 50rpx;
          line-height: 50rpx;
          background: rgba(255, 255, 255, 1);
          border-radius: 14rpx;
          font-size: 26rpx;
          color: #d2a168;
        }
        .validate-btn {
          // margin-right: 20rpx;
        }
        .user-btn {
          color: #fff;
          background-color: transparent;
          font-size: 26rpx;
        }
      }
    }
  }
  .enough_bg {
    width: 640rpx;
    height: 160rpx;
    margin: 0 auto;
    background-image: url('http://cdn.swh296.com/img/store-manage/simple-bg.png');
    background-size: 100% 100%;
    @include flexSA;
    .item {
      @include flexY;
      @include flexA;
      color: #999999;
      font-size: 24rpx;
      .num {
        color: #333537;
        font-size: 36rpx;
        margin-bottom: 15rpx;
      }
    }
  }
  .tab {
    width: 100%;
    height: 100rpx;
    @include flexX;
    .tab-item {
      flex: 1;
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
      position: relative;
      &.active {
        font-weight: bold;
        @include active;
      }
    }
  }
  .detail-section {
    // width: 100%;
    padding: 30rpx 30rpx 120rpx;
    background-color: #fff;
    .item {
      width: 100%;
      height: 60rpx;
      line-height: 60rpx;
      @include flexSB;
      font-size: 28rpx;
      color: #333537;
      .item-l {
      }
      .item-r {
        color: #999999;
        font-size: 24rpx;
      }
    }
  }
  .bt-section {
    width: 100%;
    height: 120rpx;
    border-top: 1px solid #dddddd;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #fff;
    .cu-btn {
      width: 90%;
      margin: 15rpx 5% 0;
      height: 90rpx;
      background: linear-gradient(-90deg, rgba(242, 106, 83, 1) 0%, rgba(238, 67, 39, 1) 100%);
      border-radius: 45rpx;
      color: #ffffff;
      font-size: 34rpx;
    }
  }
}
</style>
