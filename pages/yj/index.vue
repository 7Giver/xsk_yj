<template>
  <view class="container">
    <!-- 头部 -->
    <view class="info_header">
      <view class="inner">
        <image class="upic" :src="userInfo.avatar_text" mode=""></image>
        <view class="yj_num">
          <p>{{coin}}</p>
          <text>当前营家币</text>
        </view>
        <button>充值</button>
      </view>
    </view>
    <!-- 公告 -->
    <view class="notice">
      <image class="icon_l" src="https://cdn.swh296.com/img/yj/icon_notice.png" mode=""></image>
      <view class="cont">
        <!-- 这是一篇文章文章的内容是什么这是一篇文章文章的内容是什么这是一篇文章文章的内容是什么 -->
        <scroll-view scroll-y="true">
          <swiper vertical="true" autoplay="true" class="notice_swiper">
            <swiper-item v-for="(item, index) in noticeList" :key="index" @click="_showModal(item.title)">
              <!-- <image :src="item.src" /> -->
              <text>{{ item.title }}</text>
            </swiper-item>
          </swiper>
        </scroll-view>
      </view>
    </view>
    <!--  -->
    <!-- 头部轮播 -->
    <view class="carousel-section">
      <swiper class="carousel" circular @change="swiperChange">
        <swiper-item v-for="(item, index) in swiperList" :key="index" class="carousel-item" @click="navToDetailPage({ title: '轮播广告' })"><image :src="item.src" /></swiper-item>
      </swiper>
    </view>
    <!-- 分类 -->
    <view class="cate-section">
      <view class="cate-item" v-for="(item, index) in cateList" :key="index">
        <image :src="item.cate_src"></image>
        <text>{{ item.cate_text }}</text>
      </view>
    </view>
    <!--营家精选  -->
    <view class="splitCls"></view>
    <view class="choice-ness">
      <view class="choice-title">
        <text class="c-l">营家精选</text>
        <view class="more">
          <text>更多</text>
          <text class="yticon icon-you"></text>
        </view>
      </view>
      <view class="pro-section">
        <view v-for="(item, index) in goodsList" :key="index" class="guess-item" @click="navToDetailPage(item)">
          <view class="image-wrapper"><image :src="item.image" mode="aspectFill"></image></view>
          <text class="title">{{ item.title }}</text>
          <p class="price">
            {{ item.price }}
            <text>营家币</text>
          </p>
         <!-- <view class="desc">
            <view>满88包邮</view>
            <view>新品</view>
          </view> -->
        </view>
      </view>
    </view>
    <view class="hot-section">
      <image class="hot_type" src="https://cdn.swh296.com/img/yj/hot_type.png" mode=""></image>
      <view class="type_cont">
        <view class="item" v-for="(item,index) in typeList" :style="{background:item.bg_color,color:item.text_color}" :key="index">
          {{item.text}}
        </view>
      </view>
      <view class="pro-section">
        <view v-for="(item, index) in coinList" :key="index" class="guess-item" @click="navToDetailPage(item)">
          <view class="image-wrapper"><image :src="item.image" mode="aspectFill"></image></view>
          <text class="title">{{ item.title }}</text>
          <text class="yj_money">{{ item.price }}营家币</text>
        </view>
      </view>
      <view class="more">
        <text>查看全部</text>
        <text class="yticon icon-you"></text>
      </view>
    </view>
    <!--  -->
    <tui-modal :show="isNoticeModal" @cancel="isNoticeModal=false" :custom="true" :fadein="true">
      <view class="tui-modal-custom">
       <view class="tui-item">
          <view class="tui-prompt-title">公告通知</view>
        </view>
        <view class="content">
          {{noticeText}}
        </view>
        <tui-button shape="circle" class="tui-btn" type="danger" @click="isNoticeModal=false">确定</tui-button>
      </view>
    </tui-modal>
    <!--  -->
  </view>
</template>

<script>
import {mapState} from 'vuex';
import tuiModal from '@/components/ThorUI/modal/modal';
import tuiButton from '@/components/ThorUI/button/button';
export default {
  components:{
    tuiModal,
    tuiButton
  },
  data() {
    return {
      goodsList: [],
      coinList:[],
      noticeList: [],
      isNoticeModal:false,
      noticeText:'',
      // 分类
      cateList: [
        {
          cate_src: 'https://cdn.swh296.com/img/yj/icon_dingdan.png',
          cate_text: '营家币订单'
        },
        {
          cate_src: 'https://cdn.swh296.com/img/yj/icon_mingxi.png',
          cate_text: '营家币明细'
        },
        {
          cate_src: 'https://cdn.swh296.com/img/yj/icon_duihuan.png',
          cate_text: '可兑换'
        },
        {
          cate_src: 'https://cdn.swh296.com/img/yj/icon_paihang.png',
          cate_text: '兑换排行'
        }
      ],
      typeList:[
        {
          text:'日用家居',
          bg_color:'#FEEEEE',
          text_color:'#FB9B9B'
        },
        {
          text:'家用电器',
          bg_color:'#EDF9F1',
          text_color:'#73DE95'
        },
        {
          text:'数码配件',
          bg_color:'#F3F6FE',
          text_color:'#8493F0'
        },
        {
          text:'生活服务',
          bg_color:'#EAF6FC',
          text_color:'#7CC6F2'
        },
        {
          text:'户外活动',
          bg_color:'#FFF4E9',
          text_color:'#E7BB90'
        },
        {
          text:'美妆美容',
          bg_color:'#EEFBF6',
          text_color:'#71D8BC'
        }
      ],
      // 轮播
      swiperList: [
        {
          src: 'https://cdn.swh296.com/img/yj/swiper.png'
        }
      ],
      page:1,
      cat_id:'',
      coin:0
    };
  },
  computed: {
    ...mapState(['userInfo','token'])
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    _showModal(title){
      this.isNoticeModal = true
      this.noticeText = title
    },
    async loadData() {
      this.getCoin()
      this.getRecommendProducts()
      this.getCoinProducts()
      this.getAnnouncement()
    },
    //   token 
    getCoin(){
      this.$http
        .post(`/api/merchants/coins/getCoin`,{
          token:this.token || uni.getStorageSync('state_token') 
        })
        .then(response => {
          const data = response;
          console.log(response.code)
          if (data.code == 1) {
            this.coin = response.data
            console.log('this.coin',this.coin)
          }else{
            this.$api.msg(response.msg)
          }
        })
    },
    // 推荐列表
    getRecommendProducts(){
      this.$http
        .post(`/api/merchants/coins/getRecommendProducts`,{
          token:this.token || uni.getStorageSync('state_token') ,
          page:this.page,
          limit:10,
          cat_id:this.cat_id
        })
        .then(response => {
          const data = response.data;
          console.log(response)
          if (response.code == 1) {
            if(data.data.length>=6){
              this.goodsList = data.data.splice(0,6)
            }else{
              this.goodsList = data.data
            }
          }else{
            this.$api.msg(response.msg)
          }
        })
    },
    // 热兑类目
    getCoinProducts(){
      this.$http
        .post(`/api/merchants/coins/getCoinProducts`,{
          token:this.token || uni.getStorageSync('state_token') ,
          page:this.page,
          limit:10,
          cat_id:this.cat_id
        })
        .then(response => {
          const data = response.data;
          console.log(response)
          if (response.code == 1) {
            if(data.data.length>=6){
              this.coinList = data.data.splice(0,6)
            }else{
              this.coinList = data.data
            }
          }else{
            this.$api.msg(response.msg)
          }
        })
    },
    getAnnouncement(){
      this.$http
        .post(`/api/merchants/coins/getAnnouncement`,{
          token:this.token || uni.getStorageSync('state_token') 
        })
        .then(response => {
          const data = response.data;
          console.log(response)
          if (response.code == 1) {
            this.noticeList = data
          }else{
            this.$api.msg(response.msg)
          }
        })
    },
    //轮播图切换修改背景色
    swiperChange(e) {
      const index = e.detail.current;
    },
    //详情页
    navToDetailPage(item) {
      // let id = item.id;
      // uni.navigateTo({
      //   url: `/pages/product/product?id=${id}`
      // });
    }
  },
  // #ifndef MP
  // 标题栏input搜索框点击
  onNavigationBarSearchInputClicked: async function(e) {
    this.$api.msg('点击了搜索框');
  },
  //点击导航栏 buttons 时触发
  onNavigationBarButtonTap(e) {
    const index = e.index;
    if (index === 0) {
      this.$api.msg('点击了扫描');
    } else if (index === 1) {
      // #ifdef APP-PLUS
      const pages = getCurrentPages();
      const page = pages[pages.length - 1];
      const currentWebview = page.$getAppWebview();
      currentWebview.hideTitleNViewButtonRedDot({
        index
      });
      // #endif
      uni.navigateTo({
        url: '/pages/notice/notice'
      });
    }
  }
  // #endif
};
</script>

<style lang="scss">
@import 'mixin.scss';
/* #ifdef MP */
.mp-search-box {
  position: absolute;
  left: 0;
  top: 30rpx;
  z-index: 9999;
  width: 100%;
  padding: 0 80rpx;
  .ser-input {
    flex: 1;
    height: 56rpx;
    line-height: 56rpx;
    text-align: center;
    font-size: 28rpx;
    color: $font-color-base;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.6);
  }
}
.tui-modal-custom{
  .tui-item{
    line-height: 80rpx;
    text-align: center;
    font-size: 36rpx;
  }
  .content{
    border: 1px solid #e6e6e6;
    padding: 30rpx 20rpx;
    border-radius: 5px;
  }
  .tui-btn{
    margin-top: 40rpx;
    font-size: 30rpx;
    height: 70rpx;
    line-height: 70rpx;

  }
}

/* #endif */

.info_header {
  width: 100%;
  height: 345rpx;
  background-image: url('https://cdn.swh296.com/img/yj/yj_t_bg.png');
  background-size: 100% 100%;
  position: relative;
  .inner {
    width: 708rpx;
    height: 281rpx;
    position: absolute;
    left: 21rpx;
    bottom: 0;
    background-image: url('https://cdn.swh296.com/img/yj/yj_t_bg1.png');
    background-size: 100% 100%;
    @include flexY;
    @include flexA;
    .yj_num {
      @include flexY;
      color: #fff;
      p {
        font-size: 50rpx;
        margin-bottom: 5rpx;
        text-align: center;
      }
      text {
        font-size: 26rpx;
      }
    }
    .upic {
      width: 71rpx;
      height: 71rpx;
      margin: 52rpx auto 26rpx;
      border-radius: 50%;
    }
  }
  button {
    position: absolute;
    right: 20rpx;
    top: 30rpx;
    width: 126rpx;
    height: 50rpx;
    line-height: 50rpx;
    border: 1px solid rgba(255, 255, 255, 1);
    border-radius: 20px;
    background-color: transparent !important;
    color: #fff !important;
    font-size: 20rpx;
  }
}
.notice {
  background: rgba(247, 244, 239, 1);
  border-radius: 10px;
  margin: 20rpx 36rpx;
  padding: 20rpx;
  @include flexX;
  .icon_l {
    @include wh(54rpx);
  }

  .cont {
    margin-left: 20rpx;
    flex: 1;
  }
  .notice_swiper {
    height: 50rpx;
    line-height: 50rpx;
    text {
      width: 100%;
      display: inline-block;
      @include txt_cut;
      font-size: 26rpx;
    }
  }
}
.m-t {
  margin-top: 16rpx;
}
/* 头部 轮播图 */
.carousel-section {
  width: 710rpx;
  height: 170rpx;
  margin: 0 auto;
  swiper {
    width: 100%;
    height: 100%;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
/* 分类 */
.cate-section {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding: 30rpx 32rpx;
  background: #fff;
  .cate-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 26rpx;
    color: #464042;
  }
  image {
    width: 72rpx;
    height: 72rpx;
    margin-bottom: 14rpx;
  }
}

.f-header {
  display: flex;
  align-items: center;
  height: 140rpx;
  padding: 6rpx 30rpx 8rpx;
  background: #fff;
  image {
    flex-shrink: 0;
    width: 80rpx;
    height: 80rpx;
    margin-right: 20rpx;
  }
  .tit-box {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .tit {
    font-size: $font-lg + 2rpx;
    color: #font-color-dark;
    line-height: 1.3;
  }
  .tit2 {
    font-size: $font-sm;
    color: $font-color-light;
  }
  .icon-you {
    font-size: $font-lg + 2rpx;
    color: $font-color-light;
  }
}
.pro-section {
  display: flex;
  flex-wrap: wrap;
  padding: 0 30rpx;
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
.choice-ness {
  background-color: #fff;
  .choice-title {
    padding: 40rpx 30rpx;
    @include flexSB .c-l {
      color: #323234;
      font-size: 36rpx;
      font-style: oblique;
    }
    .more {
      font-size: 30rpx;
      color: rgba(153, 153, 153, 1);
      @include flexX .icon-you {
        margin-top: 5rpx;
      }
    }
  }
}
.hot-section{
  width: 100%;
  .hot_type{
    width: 100%;
    height: 132rpx;
  }
  .type_cont{
    padding: 0 30rpx;
    margin-bottom: 40rpx;
    @include  flexX;
    @include flexJ;
    .item{
      width:108rpx;
      margin-right:5rpx ;
      padding: 0 25rpx;
      height:98rpx;
      border-radius:4rpx;
      font-size:29rpx;
      @include flexY;
      @include flexJ;
    }
  }
  .pro-section{
    .guess-item{
      border:1px solid rgba(227, 226, 225, 1);
      margin-bottom: 20rpx;
      .title{
        margin-left: 20rpx;
      }
      .yj_money{
        font-size:26rpx;
        margin-left: 20rpx;
        color:rgba(220,184,109,1);
        font-weight:bold;
      }
    }
  }
  .more{
    width: 100%;
    // height: 80rpx;
    margin: 20rpx auto 40rpx;
    font-size:30rpx;
    color: #333537;
    @include flexX;
    @include flexJ;
    .icon-you{
      margin-top: 5rpx;
    }
  }
}

</style>
