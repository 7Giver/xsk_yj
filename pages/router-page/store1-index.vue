<template>
  <view style="height: 100%;">
    <view class="header" v-if="isShow">
      <image  class="showimage" src="https://cdn.swh296.com/img/store-info/info_bg.jpg" mode=""></image>
      <view class="store" v-if="storeInfo.name">
        <view class="store-l">
          <image :src="storeInfo.log_image_text" mode=""></image>
          <view class="">
            {{storeInfo.name}}
          </view>
        </view>
        <!-- !storeInfo.name -->
        <button type="primary" v-if="storeInfo.attention.length==0 && storeInfo.id != userInfo.store_id" @click="_collectStore" :class="{ collectCls: isCollect}">{{collectText}}</button>
      </view>
    </view>
    <view class="coupon-section" v-if="isShow && couponList.length>0">
      <scroll-view scroll-x class="scroll-coupon">
        <view class="coupon-item" @click="_getCoupon(item,index)" v-for="(item,index) in couponList" :class="[item.receive_status==0 ? 'no-get':'alr-get']" :key="index">
          <image class="coupon-bg" :src="item.bgImg" mode=""></image>
          <image class="coupon-get" v-if="item.receive_status==1"  src="https://cdn.swh296.com/img/store-info/get1.png" mode=""></image>
          <view class="coupon-t">
            <view class="price-inner">
              <text>￥</text>
              <text class="price">{{item.money}}</text>
            </view>
            <view class="cut">
              <view v-show="item.type !=3">
                满{{item.order_min_amount}}-{{item.money}}
              </view>
              <button type="default" class="cu-btn">立即领券</button>
            </view>
          </view>
          <view class="coupon-b">
            {{item.desc}}
          </view>
        </view>
      </scroll-view>
    </view>
    <!-- <view class="nav-section" :class="[isShow ? '':'poscls']"> -->
    <view class="nav-section" v-if="isShow">
        <view class="cu-item" :class="index == TabCur ? 'active' : ''" v-for="(item, index) in category" :key="index" @tap="tabSelect" :data-type="item.type" :data-id="index">
          <text>
            {{ item.text }}
          </text>
        </view>
    </view>
    <!--  :style="{height:height}"   lower-threshold=20 -->
    <!-- <scroll-view scroll-y="true" @scroll="scroll" :style="{height:height}" class="scroll-view" @scrolltolower="getHomeList"> -->
    <scroll-view scroll-y="true" @scroll="scroll" :style="{height:height}" class="scroll-view" @scrolltolower="tolower">
      <!-- <view class="list"> -->
        <view class="pro-section" v-if="goodsList.length>0">
          <view v-for="(item, index) in goodsList" :key="index" class="guess-item" @click="navToDetailPage(item)">
            <view class="image-wrapper"><image :src="item.image[0]" mode="aspectFill"></image></view>
            <text class="title">{{ item.description }}</text>
            <p class="price">
              ¥{{ item.price }}
            </p>
            <view class="desc">
              <view v-for="(s,i) in item.service_tags" :key="i">{{s}}</view>
            </view>
          </view>
        </view>
      <!-- </view> v-if="loadmore" -->
      <uni-load-more v-if="loadmore" :status="loadingType"></uni-load-more>
    </scroll-view>
    <rf-loading v-if="loading"></rf-loading>
    <empty v-if="isLoaded && goodsList.length==0" isTop="50%" setSrc="https://cdn.swh296.com/img/common/empty_content.png">
      <view class="empty-text">
        暂无相关商品
      </view>
    </empty>
    <!-- <image v-if="isCanGetCoupon" class="get_coupon_img animation-shake" @click="_getCoupon" src="https://cdn.swh296.com/img/common/packet1.png" mode=""></image> -->
  </view>
</template>

<script>
import {authSetting} from '../../common/js/commonInfo.js'
import {mapState} from 'vuex'
import empty from "@/components/empty";
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
let timer = null
export default {
  components:{
    empty,
    uniLoadMore,
  },
  data() {
    return {
      list: [],
      loading:true,
      category: [
        {
          text:'精选',
          id:0,
          type:'all'
        },
        {
          text:'热销',
          id:1,
          type:'hot'
        },
        {
          text:'商品',
          id:2,
          type:'rec'
        },
        {
          text:'新品',
          id:3,
          type:'new'
        }
      ],
      isLoaded:false,
      TabCur: 0,
      scrollLeft: 0,
      goodsList: [],
      storeInfo:{
        log_image_text:'',
        name:''
      },
      type:'all',
      page:1,
      limit:10,
      collectText:'已收藏',
      isCollect:false,
      loadingType:'loading',
      loadmore:false,
      scrollY:true,
      height:'800',
      isShow:true,
      isNavStyle:{}, 
      isScrollOver:false,
      isCanGetCoupon:false,
      couponId:'',
      couponList:[]
    };
  },
  computed: {
    ...mapState(['token','userInfo','storeId'])
  },
   mounted(options) {
    // let windowHeight = uni.getSystemInfoSync().windowHeight
    // this.height = windowHeight - 230 +'px'   
    this.getStoreInfo()
    this.storeCoupon()
    this.getHomeList()
  },
  methods: {
    navToLogin(){
      if(!this.userInfo.mobile){
        uni.navigateTo({
          url:'/pages/login/login'
        })
        return false
      }else{
        return true
      }
    },
    _collectStore(){
      if(!this.navToLogin()){
        this.navToLogin()
      }else{
        this.collectSwitch()
      }
    },
    tabSelect(e) {
      this.TabCur = e.currentTarget.dataset.id;
      this.cid = e.currentTarget.dataset.id;
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
      uni.showLoading({
        title:'加载中'
      })
      this.page = 1;
      this.type = e.currentTarget.dataset.type
      this.isLoaded = false
      this.loadmore = false
      this.goodsList = []
      this.getHomeList()
    },
    navToDetailPage(item){
    	let id = item.id
    	uni.navigateTo({
    		url: `/pages/product/product?id=${id}`
    	})
    },
    jump_detail(id) {
      uni.navigateTo({
        url: '../home/detail?id=' + id
      });
    },
    //   id 优惠券id
    storeCoupon(){
      this.$http
        .post(`/addons/xshopcoupon/coupon/storeCoupon`,{
          store_id:this.storeId,
          token:this.token || uni.getStorageSync('state_token')
        })
        .then(response => {
          const data = response.data;
          if (response.code == 1) {
            data.map(v=>{
              if(v.receive_status == 0){
                v.bgImg = 'https://cdn.swh296.com/img/store-info/couon.png'
              }else{
                v.bgImg = 'https://cdn.swh296.com/img/store-info/couon1.png'
              }
            })
            this.couponList = data
            let windowHeight = uni.getSystemInfoSync().windowHeight
            if(data.length>0){
              this.height = windowHeight - 316 +'px'
            }else{
              this.height = windowHeight - 230 +'px'
            }
          }
        })
    },
    _getCoupon(item,index){
      if(!this.navToLogin()){
        this.navToLogin()
      }else{
        if(item.receive_status == 0){
          this.addCoupon(item,index)
        }
      }
    },
    addCoupon(item,index){
      this.$http
        .post(`/addons/xshopcoupon/coupon/addCoupon`,{
          id:item.id,
          token:this.token
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            this.$api.msg('领取优惠券成功~')
            this.isShow =false
            this.isShow =true
            this.$set(this.couponList[index],'receive_status',1)
            this.$set(this.couponList[index],'bgImg','https://cdn.swh296.com/img/store-info/couon1.png')
            
          }else{
            this.$api.msg(response.msg)
          }
        })
    },
    collectSwitch(){
      let status = (this.collectText == '已收藏' ? 0:1)
      this.$http
        .post(`/api/store/collect/switch`,{
          store_id:this.storeId,
          token:this.token,
          status:status
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            this.collectText = this.collectText =='已收藏' ? '收藏店铺' : '已收藏'
            this.isCollect =this.collectText =='已收藏' ? true : false
            this.$api.msg(response.msg)
          }
        });
    },
    getStoreInfo(){
     this.$http
       .post(`/api/store/store/info`,{
         id:this.storeId,
         token:this.token || uni.getStorageSync('state_token') 
       })
       .then(response => {
         const data = response.data;
         uni.hideLoading()
         this.loading = false
         if (response.code === 1) {
           this.loaded = true
           this.storeInfo = data.store_info
           uni.setNavigationBarTitle({
             title:data.store_info.name
           })
           if(data.store_info.attention.length>0){
             this.collectText = '已收藏'
             this.isCollect = true
           }else{
             this.collectText = '收藏店铺'
             this.isCollect = false
           }
         }
       });
   },
    getCategory(){
      this.$http
        .post(`/api/store/store/category`,{
          id:this.storeId
        })
        .then(response => {
          const data = response.data;
          uni.hideLoading()
          if (response.code === 1) {
          }
        });
    },
    // 
    scroll(e){
      let windowHeight = uni.getSystemInfoSync().windowHeight
      let barHeight = uni.getSystemInfoSync().statusBarHeight
        if(this.isScrollOver){
        	return;
        }
        console.log('isScrollOver',this.isScrollOver)
        console.log('e',e.detail.scrollTop)
        // 判断有优惠券的情况下
        if(this.couponList.length>0){
          console.log('e',e.detail.scrollTop)
          if(e.detail.scrollTop>120){
            this.height=windowHeight - 50  +'px'
            this.isShow = false
          }else {
            this.height = windowHeight - 316 +'px'
            this.isShow = true
          }
        }else{
          if(e.detail.scrollTop>120){
          // if(e.detail.scrollTop>50){
            this.height=windowHeight - 50  +'px'
            this.isShow = false
          }else {
            this.isShow = true
            this.height = windowHeight - 230 +'px'
          }
        }
    },
    //
    tolower(e){
      if(e.detail){
        if(!this.isgetList) {
          this.isgetList= true
          this.getHomeList()
        }
      }
    },
    getHomeList(){
      this.isScrollOver = true
      this.$http
        .post(`/api/store/product/getHomeList`,{
          id:this.storeId,
          page:this.page,
          type:this.type
        })
        .then(response => {
          const data = response.data.data;
          if (response.code == 1) {
            this.isgetList = false 
           uni.hideLoading()
           if(this.page == 1){
             if(data.length<this.limit){
               if(data.length ==0) {
                 this.loadmore = false
               }else{
                 this.loadmore = true
               }
               this.loadingType = 'noMore'
             }else{
               this.loadingType = 'more'
               this.loadmore = true
               this.page ++
             }
             this.goodsList = data
           }else {
             this.page ++
             if(data.length<this.limit){
               this.loadingType = 'noMore';
             }else{
               this.loadingType = 'more';
             }
             this.goodsList = this.goodsList.concat(data)
             this.loadmore = true
           }
           this.isLoaded = true
           this.isScrollOver = false
          }
        });
    },
  }
};
</script>
<style lang="scss">
  .empty-content{
    top: 50% !important;
  }
</style>
<style lang="scss" scoped>
@import  'mixin.scss';
@import "../../colorui/animation.css";
page,.app-container{
  background-color: #fff !important;
}
// /deep/
::v-deep.empty-content{
    top: 50% !important;
}
.coupon-section{
  width: 100%;
  height:86px;
  background:rgba(252,240,224,1);
  padding: 8px 0rpx 0;
  .scroll-coupon{
    white-space: nowrap;
    height: 70px;
    .coupon-item{
      width: 330rpx;
      margin-left: 24rpx;
      height: 70px;
      display: inline-block;
      position: relative;
      padding: 10rpx 20rpx;
      &:last-child{
        margin-right: 24rpx;
      }
      &.no-get{
        color: #9F0F0F;
        .price-inner{
          color: #FFFCE6;
        }
        .cu-btn{
          color: #F13A3C;
        }
        &.coupon-b{
          color:rgba(249,237,221,1);
        }
      }
      &.alr-get{
        color: #F3F3F3;
        .price-inner{
          color: #999999;
        }
        .cu-btn{
          color: #CDCDCD;
        }
        &.coupon-b{
          color:#EEEEEE;
        }
      }
      .coupon-bg{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
      .coupon-get{
        width: 92rpx;
        height: 81rpx;
        position: absolute;
        right: 5%;
        top: 2%;
        z-index: 9;
      }
      .coupon-t{
        @include flexSB;
        height: 75%;
        position: relative;
        .price-inner{
          @include flexX;
          font-size: 40rpx;
          margin-right: 10rpx;
          .price{
            font-size: 70rpx;
          }
        }
        .cut{
          @include flexY;
          @include flexJ;
          font-size: 22rpx;
          .cu-btn{
            margin-top: 10rpx;
            width:111rpx;
            height:36rpx;
            border-radius:4rpx;
            font-size: 22rpx;
          }
        }
      }
      .coupon-b{
        width:100%;
        position: relative;
        text-align: center;
        height:34rpx;
        line-height: 34rpx;
        font-size:20rpx;
      }
    }
  }
}
.get_coupon_img{
  width: 150rpx;
  height: 150rpx;
  position: fixed;
  bottom: 25%;
  right: 5%;
  z-index: 5;
  animation-duration: 1.5s;
  animation-iteration-count:infinite;
}
.poscls{
  position: fixed;
  top: 0;
  left: 0; 
}
.header {
  width: 100%;
  height: 260rpx;
  padding-top: 40rpx;
  overflow: hidden;
  position: relative;
  .showimage{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 260rpx;
  }
  .store{
    width:690rpx;
    margin: 21rpx auto;
    padding: 0 21rpx;
    @include flexSB;
    height:130rpx;
    background:rgba(255,255,255,.8);
    border:1px solid rgba(227, 226, 225, 1);
    border-radius:14rpx;
    position: relative;
    .store-l{
      @include flexX;
      @include flexA;
      font-size: 28rpx;
      color: #333537;
      image{
        width: 120rpx;
        height: 60rpx;
        margin-right: 30rpx;
      }
    }
    button{
      margin: 0;
      height:52rpx;
      line-height: 52rpx;
      background:linear-gradient(-90deg,rgba(238,71,44,1),rgba(242,106,82,1));
      border-radius:26rpx;
      font-size:28rpx;
      color: #fff;
      &.collectCls{
        background:#999
      }
      // &::after{
      //   border: none;
      // }
    }
  }
}
.nav-section{
  padding: 0 10%;
  height: 100rpx;
  position: relative;
  background-color: #fff;
  @include flexX;
  // border-bottom: 1px solid #F5F5F5;
  box-sizing: content-box;
  .cu-item {
    flex:1;
    height: 100rpx;
    display: inline-block;
    line-height: 100rpx;
    // margin: 0 10rpx;
    // padding: 0 20rpx;
    text-align: center;
    position: relative;
    &.active{
      @include active
    }
  }
}
.scroll-view{
  width: 100%;
  margin-top: 10rpx;
  height: 1000px;
  // height: calc(100%-460rpx);
  // height: 1500rpx;
  // margin-bottom: 120rpx;
}
// .list{
//   width:700rpx;
//   height: 100%;
//   margin: 0 auto;
//   border-radius: 15rpx 15rpx 0 0;
//   background-color: #fff;
  .pro-section {
    width:700rpx;
    margin: 0 auto;
    border-radius: 15rpx 15rpx 0 0;
    background-color: #fff;
    display: flex;
    flex-wrap: wrap;
    padding: 10rpx 30rpx 0;
    background: #fff;
    .guess-item {
      display: flex;
      flex-direction: column;
      width: 48%;
      padding-bottom: 40rpx;
      &:nth-child(2n + 1) {
        margin-right: 4%;
      }
    }
    .image-wrapper {
      width: 100%;
      height: 330rpx;
      border-radius: 3px;
      overflow: hidden;
      image {
        width: 100%;
        height: 100%;
        opacity: 1;
      }
    }
    .title {
      margin-top: 18rpx;
      height: 90rpx;
      line-height: 45rpx;
      font-size: $font-lg;
      color: #333537;
      // line-height: 80rpx;
      @include two_txt_cut;
    }
    .price {
      font-size: 34rpx;
      color: #f64443;
      line-height: 1;
      text {
        margin-left: 5rpx;
        font-size: 24rpx;
      }
    }
    .desc {
      margin-top: 8rpx;
      @include flexX view {
        width: max-content;
        margin-right: 20rpx;
        font-size: 20rpx;
        padding: 2rpx 5rpx;
        background: rgba(9, 111, 208, 0);
        color: rgba(246, 68, 67, 1);
        border: 1px solid rgba(246, 68, 67, 1);
        border-radius: 15rpx;
      }
    }
  }
// }
</style>
