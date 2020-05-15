<template>
  <view class="container">
    <view class="tip">您可以在此页面以1：1的比例将您的零钱转化 为营家币，营家币可以在营家商城中兑换各类 精彩礼品</view>
    <view class="exchange-section">
      <view class="cm-title">兑换营家币</view>
      <view class="choose-section">
        <view class="item" v-for="(item, index) in rechargeList" :class="{ active: amountChooseId === item.id }" @click="_chooseAmount(item)" :key="index">
          <text>{{ item.num }}营家币</text>
          <text class="sale">售价{{ item.num }}</text>
        </view>
        <view class="item" @click="_chooseAmount('phone')">
          <!-- <div class="list" @tap="focus('phone')"> -->
            <view class="value" @tap="focus('phone')">
              <text :class="{ 'show-bl': borderFor == 'phone' && !login.phone, 'show-br': borderFor == 'phone' && login.phone }">{{ login.phone || '其他数额' }}</text>
            </view>
          <!-- </div> -->
        </view>
      </view>
      <view class="amount">
        <text>{{ amountNum || 0 }}</text>
        元
      </view>
    </view>
    <button class="confirm-btn">立即充值￥{{ amountNum }}</button>
    <keyboard-package :disableDot="true" :type="keyboardType" @input="inputVal" ref="keyboard"></keyboard-package>
  </view>
</template>

<script>
import keyboardPackage from '@/components/keyboard-package/keyboard-package.vue';
export default {
  components: { keyboardPackage },
  data() {
    return {
      amountNum: 100,
      amountChooseId: 3,
      borderFor: false, //当前是哪个输入框
      keyboardFor: false, //当前键盘是给谁用的
      keyboardType: 1, //键盘类型   1-数字 2-身份证 3-车牌号
      timer: false, //定时器
      login: {
        classfy: 1,
        type: 1,
        idcard: '',
        phone: '' //手机号
      },
      rechargeList: [
        {
          id: 1,
          num: 20
        },
        {
          id: 2,
          num: 50
        },
        {
          id: 3,
          num: 100
        },
        {
          id: 4,
          num: 300
        },
        {
          id: 5,
          num: 500
        }
      ]
    };
  },
  methods: {
    _chooseAmount(item) {
      if (item == 'phone') {
        this.focus(item);
        this.amountChooseId = '';
        this.amountNum = '';
      }else{
        this.amountChooseId = item.id;
        this.amountNum = item.num;
        this.login.phone = ''
        this.borderFor = false
        this.keyboardFor = false
        clearInterval(this.timer);
      }
    },
    focus(type) {
      let typeArr = {
        phone: 1,
        checkcode: 1,
        idcard: 2,
        plateNumber: 3
      };
      if (this.borderFor != type) {
        this.keyboardFor = type;
        this.keyboardType = typeArr[type];
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          this.borderFor = this.borderFor == type ? false : type;
        }, 500);
      }
      this.$refs.keyboard.open();
    },
    inputVal(val) {
      val = val.toString();
      let key = this.keyboardFor;
      let _this = this;
      const writeValue = (key, maxlength) => {
        let len = _this.login[key].length;
        if (!val) {
          _this.login[key] = _this.login[key].substring(0, len - 1);
          return;
        }
        if (len === maxlength) return;
        _this.login[key] += val;
      };

      const funArr = {
        phone() {
          writeValue(key, 4);
        },
        idcard() {
          writeValue(key, 18);
        },
        plateNumber() {
          writeValue(key, 7);
        },
        checkcode() {
          writeValue(key, 6);
        }
      };
      funArr[key]();
      _this.amountNum = _this.login.phone
    }
  }
};
</script>

<style lang="scss">
@import 'mixin.scss';
.container {
  .tip {
    width: 690rpx;
    padding: 30rpx 40rpx;
    margin: 30rpx auto;
    height: 180rpx;
    background: rgba(254, 249, 238, 1);
    border-radius: 6rpx;
    color: rgba(218, 179, 102, 1);
    font-size: 30rpx;
  }
  .exchange-section {
    width: 690rpx;
    margin: 0 auto;
    font-size: 30rpx;
    color: #333537;
    .cm-title {
      width: 100%;
      margin-bottom: 30rpx;
      height: 80rpx;
      line-height: 90rpx;
      border-bottom: 1px solid #e8e8e8;
    }
    .choose-section {
      @include flexSB;
      flex-wrap: wrap;
      .item {
        width: 27%;
        margin-bottom: 20rpx;
        height: 140rpx;
        padding: 0 20rpx;
        @include flexY;
        @include flexJ;
        @include flexA;
        border-radius: 6rpx;
        border: 2rpx solid rgba(239, 239, 241, 1);
        &.active {
          background: rgba(246, 68, 67, 1);
          color: #fff;
          border: none;
          .sale {
            color: #fff;
          }
        }
        .sale {
          color: #999999;
          font-size: 26rpx;
        }
        // .list {
          // border-bottom: 1px solid #efefef;
          // color: #777;
          // padding: 5px 10px;
          // margin: 5px auto;
          // display: flex;
          // justify-content: space-between;
          // align-items: center;
          // font-size: 0.9rem;
          // .name {
          //   width: 32%;
          // }
          .value {
            // width: 68%;
            color: #777;
            text {
              border: 4rpx solid transparent;
            }
            .show-bl {
              border-left-color: #ccc;
            }
            .show-br {
              border-right-color: #ccc;
            }
            .send-btn {
              width: 50%;
              // font-size: 0.8rem;
              text-align: center;
              color: #a7cf2b;
            }
            .sending {
              color: #ccc !important;
            }
          }
        // }
      }
    }
    .amount {
      width: 690rpx;
      margin: 30rpx auto 0;
      font-size: 34rpx;
      text {
        color: #f64443;
        font-size: 44rpx;
      }
    }
  }
  .confirm-btn {
    position: fixed;
    width: 660rpx;
    left: 45rpx;
    bottom: 60rpx;
    // margin: 60rpx auto;
    height: 90rpx;
    background: linear-gradient(-90deg, rgba(242, 106, 83, 1) 0%, rgba(238, 67, 39, 1) 100%);
    border-radius: 45rpx;
    font-size: 34rpx;
    color: #fff;
  }
}
//键盘
.account-wrap {
  .change-bar div {
    width: 50%;
    text-align: center;
    color: #777;
    padding: 3px 0;
  }
  .login-box {
    margin-top: 10px;
  }
  .line {
    width: 40%;
    left: 5%;
    top: 45px;
    background: #a7cf2b;
    height: 2px;
    position: fixed;
    border-radius: 5px;
  }
  .list {
    // border-bottom: 1px solid #efefef;
    color: #777;
    padding: 5px 10px;
    margin: 5px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
    .name {
      width: 32%;
    }
    .value {
      width: 68%;
      text {
        border: 4rpx solid transparent;
      }
      .show-bl {
        border-left-color: #ccc;
      }
      .show-br {
        border-right-color: #ccc;
      }
      .send-btn {
        width: 50%;
        font-size: 0.8rem;
        text-align: center;
        color: #a7cf2b;
      }
      .sending {
        color: #ccc !important;
      }
    }
  }
  .submit {
    width: 80%;
    padding: 8px 0;
    margin: 40px auto;
    background: #a7cf2b;
    text-align: center;
    color: #fff;
    border-radius: 20px;
    box-shadow: 0 0 3px 1px #ccc;
  }
  .login-type {
    text-align: center;
    color: #777;
    font-size: 0.7rem;
    image {
      width: 30px;
      height: 30px;
      margin: 5px 10px;
    }
  }
}
</style>
