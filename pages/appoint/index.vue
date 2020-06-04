<template>
  <view class="container">
    <navigator url="./pay"><image class="banner" v-if="!isroleId" src="https://cdn.swh296.com/img/appoint/appoint_banner.png" mode=""></image></navigator>
    <view class="nav-list">
      <view class="item" v-for="(item, index) in navList" @click="_changeNav(item)" :key="index">
        <image :src="item.image" mode=""></image>
        <text>{{ item.text }}</text>
      </view>
    </view>
    <!-- 取衣服 -->
    <view class="textarea-section" v-if="navid == 1">
      <textarea value="" class="textarea" v-model="textareaData" placeholder="您可以填写服务详细信息，跑腿小哥为您 服务！" />
      <view class="example-inner" @click="_moreExample">
        <text>点击可快捷输入</text>
        <text class="active">查看填写示例</text>
        <text class="yticon icon-you"></text>
      </view>
    </view>
    <!-- 买菜 -->
    <view class="greens-section" v-if="navid == 3">
      <view class="greens-item" v-for="(item, index) in greensList" @click="_changeGreen(item,index)" :class="{ active: item.code == greens_id }" :key="index">
        <view class="meal">套餐{{ index + 1 }}</view>
        <view class="center">
          <text v-for="(s,i) in item.value_text" :key="i">{{s.name}} </text>
        </view>
        <view class="more" @click="_more(item)">
          <text>查看全部</text>
          <text class="price">{{ item.price }}元</text>
        </view>
      </view>
    </view>
    <button class="s-bg-linear" @click="_toOrder">去下单</button>
    <button @click="_authLocaiton">去下单</button>
    <!-- <button open-type="openSetting" @opensetting="_authLocaiton">去下单</button> -->
    <!-- 示例弹窗 -->
    <view class="draw_modal" v-if="isExampleModal" @click="isExampleModal = false"></view>
    <view class="example-modal" v-if="isExampleModal" @click.stop="isExampleModal = false">
      <view class="title">填写示例</view>
      <scroll-view scroll-y="true" class="content">
        <view class="item" v-for="(item,index) in exampleList" :key="index">
          <view class="text">{{item.value}}</view>
          <view class="copy" @click="_copy(item)">
            <image src="https://cdn.swh296.com/img/appoint/icon_copy.png" mode=""></image>
            <text>复制文本</text>
          </view>
        </view>
      </scroll-view>
      <image class="close" src="https://cdn.swh296.com/img/appoint/icon_close.png" mode=""></image>
    </view>
    <!-- 买菜弹窗 -->
    <view class="draw_modal" v-if="isgreensMore" @click="isgreensMore = false"></view>
    <view class="example-modal" v-if="isgreensMore" @click.stop="isgreensMore = false">
      <view class="title">套餐{{greensInfo.id}}</view>
      <!-- <view class="content"> -->
        <scroll-view scroll-y="true" class="content">
        <view class="greens-modal-item" v-for="(item,index) in greensInfo.list" :key="index">
          <text>{{item.name}}</text>
          <text class="weight">{{item.weight}}</text>
        </view>
        </scroll-view>
      <!-- </view> -->
      <image class="close" src="https://cdn.swh296.com/img/appoint/icon_close.png" mode=""></image>
    </view>
  </view>
</template>

<script>
  import {authSettingLocation} from '../../common/js/commonInfo.js'
export default {
  data() {
    return {
      exampleList:[],
      greensInfo:{
        id:'',
        list:[
        ]
      },
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
          id: 2,
          url:'/pages/appoint/create_order'
        },
        {
          image: 'https://cdn.swh296.com/img/appoint/icon_maicai.png',
          text: '买菜',
          id: 3
        },
        {
          image: 'https://cdn.swh296.com/img/appoint/icon_dqj.png',
          text: '代取件',
          id: 4,
          url:'/pages/appoint/create_order'
        },
        {
          image: 'https://cdn.swh296.com/img/appoint/icon_jc.png',
          text: '寄存',
          id: 5,
          url:'/pages/appoint/send_receive_order'
        }
      ],
      navid: 1,
      isExampleModal: false,
      greens_id: '',
      greensList: [
      ],
      isroleId:true
    };
  },
  mounted() {
    this.getPackageList()
    this.getMemStatus()
  },
  methods: {
    getMemStatus(){
      var _this = this
      this.$http
        .post(`/addons/microlife/member/status`)
        .then(response => {
          const data = response.data
          if (response.code === 1) {
            this.isroleId =data && data.expiretime_text ? true : false
          }
        });
    },
    // 通用备注
    general(){
      var _this = this
      this.$http
        .post(`/addons/microlife/remark/general`)
        .then(response => {
          const data = response.data
          console.log('general',data)
          if (response.code === 1) {
            this.exampleList = data
            this.isExampleModal = true
            uni.hideLoading()
          }
        });
    },
    getPackageList(){
      var _this = this
      this.$http
        .post(`/addons/microlife/package/list`)
        .then(response => {
          const data = response.data
          console.log('getPackageList',data)
          if (response.code === 1) {
            _this.greensList = data.data
            _this.greens_id = _this.greensList[0].code
            _this.greensList.map(v=>{
              v.value_text.map(s=>{
                s.name = s.name + ' '
              })
            })
          }
        });
    },
    _moreExample(){
      uni.showLoading({
        title:'加载中...'
      })
      this.general()
    },
    _toOrder(){
      // 类型:1=洗衣,2=购物,3=寄快递,4=取快递,5=寄存
      // 取送衣
      
      // 快递
      
      // 买菜
      
      // 代取件
      
      // 寄存物品
      let optData ={
        type:this.navid,
        value:this.textareaData
      }
      uni.navigateTo({
        url:`/pages/appoint/create_order?optData=${JSON.stringify(optData)}`
      })
    },
    _authLocaiton(e){
      console.log(e)
      // let detail = e.detail.authSetting
      uni.chooseLocation({
          success: function (res) {
              console.log('位置名称：' + res.name);
          }
      })
      // uni.openSetting({
      //   success(res) {
      //     console.log(res.authSetting)
      //   }
      // });
      // if(detail['scope.userLocation']){
      //   uni.chooseLocation({
      //       success: function (res) {
      //           console.log('位置名称：' + res.name);
      //       }
      //   });
        
        // uni.getLocation({
        //     type: 'wgs84',
        //     success: function (res) {
        //         uni.chooseLocation({
        //             success: function (res) {
        //                 if(typeof callback =='function'){
        //                   callback(res)
        //                 }
        //             }
        //         });
        //     },fail(err) {
        //       console.warn('err',err)
        //       if(typeof callback =='function'){
        //         callback(err)
        //       }
        //     }
        // });
      // }
      // authSettingLocation(function(res){
      //   console.log('_authLocaiton',res)
      //   if(res.errMsg=='getLocation:fail auth deny'){
          
      //   }
      // })
    },
    _more(item) {
      this.isgreensMore = true;
    },
    _changeGreen(item,index) {
      this.greens_id = item.code
      console.log(item.value_text)
      this.greensInfo = {
        id:index + 1,
        list:item.value_text
      }
    },
    _changeNav(item) {
      this.navid = item.id
      if(item.url){
        let optData ={
          type:this.navid,
          value:this.textareaData
        }
        uni.navigateTo({
          url:item.url + `?optData=${JSON.stringify(optData)}`
        })
      }
    },
    _copy(item) {
      this.textareaData = item.value
      this.isExampleModal = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'mixin.scss';
body,page,
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
    .greens-modal-item{
      @include flexX;  
      @include flexJ;  
      height: 74rpx;
      font-size: 30rpx;
      .weight{
        margin-left: 50rpx;
        color: #ec6045;
      }
    }
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
