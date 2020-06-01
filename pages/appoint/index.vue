<template>
  <view class="container">
    <navigator url="./pay"><image class="banner" src="https://cdn.swh296.com/img/appoint/appoint_banner.png" mode=""></image></navigator>
    <view class="nav-list">
      <view class="item" v-for="(item, index) in navList" @click="_changeNav(item)" :key="index">
        <image :src="item.image" mode=""></image>
        <text>{{ item.text }}</text>
      </view>
    </view>
    <!-- 取衣服 -->
    <view class="textarea-section" v-if="navid == 1">
      <textarea value="" class="textarea" v-model="textareaData" placeholder="您可以填写服务详细信息，跑腿小哥为您 服务！" />
      <view class="example-inner" @click="isExampleModal = true">
        <text>点击可快捷输入</text>
        <text class="active">查看填写示例</text>
        <text class="yticon icon-you"></text>
      </view>
    </view>
    <!-- 买菜 -->
    <view class="greens-section" v-if="navid == 3">
      <view class="greens-item" v-for="(item, index) in greensList" @click="_changeGreen(item)" :class="{ active: item.id == greens_id }" :key="index">
        <view class="meal">套餐{{ index + 1 }}</view>
        <view class="center">{{ item.content }}</view>
        <view class="more" @click="_more(item)">
          <text>查看全部</text>
          <text class="price">{{ item.price }}元</text>
        </view>
      </view>
    </view>
    <button class="s-bg-linear">去下单</button>
    <!-- 示例弹窗 -->
    <view class="draw_modal" v-if="isExampleModal" @click="isExampleModal = false"></view>
    <view class="example-modal" v-if="isExampleModal" @click.stop="isExampleModal = false">
      <view class="title">填写示例</view>
      <scroll-view scroll-y="true" class="content">
        <view class="item">
          <view class="text">衣服放在快递柜子上面,非常感谢！</view>
          <view class="copy" @click="_copy">
            <image src="https://cdn.swh296.com/img/appoint/icon_copy.png" mode=""></image>
            <text>复制文本</text>
          </view>
        </view>
        <view class="item">
          <view class="text">衣服放在快递柜子上面,非常感谢！</view>
          <view class="copy">
            <image src="https://cdn.swh296.com/img/appoint/icon_copy.png" mode=""></image>
            <text>复制文本</text>
          </view>
        </view>
        <view class="item">
          <view class="text">衣服放在快递柜子上面,非常感谢！</view>
          <view class="copy">
            <image src="https://cdn.swh296.com/img/appoint/icon_copy.png" mode=""></image>
            <text>复制文本</text>
          </view>
        </view>
        <view class="item">
          <view class="text">衣服放在快递柜子上面,非常感谢！</view>
          <view class="copy">
            <image src="https://cdn.swh296.com/img/appoint/icon_copy.png" mode=""></image>
            <text>复制文本</text>
          </view>
        </view>
      </scroll-view>
      <image class="close" src="https://cdn.swh296.com/img/appoint/icon_close.png" mode=""></image>
    </view>
    <!-- 买菜弹窗 -->
    <view class="draw_modal" v-if="isgreensMore" @click="isgreensMore = false"></view>
    <view class="greens-modal" v-if="isgreensMore" @click.stop="isgreensMore = false">
      <view class="title">套餐{{greensInfo.id}}</view>
      <view class="content">
        <view class="greens-item" v-for="(item,index) in ">
          <text>{{item.name}}</text>
        </view>
      </view>
      <image class="close" src="https://cdn.swh296.com/img/appoint/icon_close.png" mode=""></image>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isgreensMore:false,
      textareaData: '',
      navList: [
        {
          image: 'https://cdn.swh296.com/img/appoint/icon_qyf.png',
          text: '取衣服',
          id: 1
        },
        {
          image: 'https://cdn.swh296.com/img/appoint/icon_kuaidi.png',
          text: '快递',
          id: 2
        },
        {
          image: 'https://cdn.swh296.com/img/appoint/icon_maicai.png',
          text: '买菜',
          id: 3
        },
        {
          image: 'https://cdn.swh296.com/img/appoint/icon_dqj.png',
          text: '代取件',
          id: 4
        },
        {
          image: 'https://cdn.swh296.com/img/appoint/icon_jc.png',
          text: '寄存',
          id: 5
        }
      ],
      navid: 1,
      isExampleModal: false,
      greens_id: 1,
      greensList: [
        {
          id: 1,
          content: '西红柿  紫甘蓝  牛 肉 鸡蛋 鲫鱼...',
          price: 50
        },
        {
          id: 2,
          content: '西红柿  紫甘蓝  牛 肉 鸡蛋 鲫鱼...',
          price: 100
        },
        {
          id: 3,
          content: '西红柿  紫甘蓝  牛 肉 鸡蛋 鲫鱼...',
          price: 100
        }
      ]
    };
  },
  methods: {
    _more(item) {
      this.isgreensMore = true;
    },
    _changeGreen(item) {
      this.greens_id = item.id;
    },
    _changeNav(item) {
      this.navid = item.id;
    },
    _copy() {
      this.textareaData = '衣服放在快递柜子上面,非常感谢！';
      this.isExampleModal = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'mixin.scss';
page,
.container {
  background-color: #f7f9fb;
}
// 买菜
.greens-section {
  padding: 0 10rpx;
  @include flexSB;
  flex-wrap: wrap;
  .greens-item {
    width: 320rpx;
    height: 218rpx;
    background: rgba(254, 255, 254, 1);
    border: 2rpx solid rgba(238, 238, 238, 1);
    border-radius: 8rpx;
    position: relative;
    margin-bottom: 30rpx;
    &.active {
      background: rgba(254, 252, 239, 1);
      border: 2rpx solid rgba(221, 207, 158, 1);
    }
    .meal {
      position: absolute;
      width: 124rpx;
      height: 42rpx;
      line-height: 42rpx;
      text-align: center;
      font-size: 26rpx;
      color: #fff;
      background: rgba(236, 96, 69, 1);
      border-radius: 0px 12px 0px 12px;
    }
    .center {
      color: #757e90;
      font-size: 26rpx;
      margin: 70rpx 20rpx 0;
    }
    .more {
      position: absolute;
      bottom: 0;
      @include flexSB;
      width: 100%;
      height: 60rpx;
      padding: 0 20rpx;
      font-size: 24rpx;
      .price {
        color: #d2b370;
      }
    }
  }
}
.example-modal {
  width: 540rpx;
  height: 586rpx;
  position: fixed;
  top: 15%;
  left: 105rpx;
  background-image: url('https://cdn.swh296.com/img/appoint/appoint_text_modal.png');
  background-size: 100% 100%;
  z-index: 9;
  .title {
    width: 100%;
    text-align: center;
    height: 90rpx;
    line-height: 90rpx;
    color: #000000;
    font-size: 34rpx;
  }
  .close {
    width: 66rpx;
    height: 66rpx;
    position: absolute;
    bottom: -20%;
    left: 50%;
    margin-left: -33rpx;
    z-index: 9;
  }
  .content {
    width: 480rpx;
    height: 496rpx;
    border-radius: 10rpx;
    margin: 0 30rpx;
    padding-bottom: 20rpx;
    background-color: #fff;
    .item {
      margin-top: 40rpx;
      padding: 0 20rpx;
      font-size: 30rpx;
      color: #434d50;
    }
    .copy {
      margin-top: 26rpx;
      @include flexX;
      justify-content: flex-end;
      // justify-content: right;
      margin-right: 10rpx;
      color: #f75347;
      font-size: 24rpx;
      image {
        width: 26rpx;
        height: 26rpx;
        margin-right: 10rpx;
      }
      text {
      }
    }
  }
}
.container {
  padding: 20rpx 30rpx 0;

  .banner {
    width: 100%;
    height: 174rpx;
  }
  .nav-list {
    width: 100%;
    padding: 20rpx 0;
    @include flexSB;
    .item {
      flex: 1;
      @include flexY;
      @include flexJ;
      @include flexA;
      image {
        width: 54rpx;
        height: 54rpx;
      }
      text {
        font-size: 24rpx;
        margin-top: 30rpx;
        color: #697484;
      }
    }
  }
  .textarea-section {
    width: 100%;
    // height:340rpx;
    background-color: #fff;
    border: 1px solid rgba(237, 239, 242, 1);
    border-radius: 6rpx;
    padding: 20rpx;
    .textarea {
      // padding: 20rpx;
      font-size: 32rpx;
    }
    .example-inner {
      @include flexX font-size: 26rpx;
      margin-bottom: 20rpx;
      text {
        color: #6b7685;
        &.active {
          margin-left: 20rpx;
          color: #f75347;
        }
        &.icon-you {
          color: #f75347;
          margin-top: 5rpx;
        }
      }
    }
  }
  .s-bg-linear {
    margin-top: 60rpx;
    color: #fff;
  }
}
</style>
