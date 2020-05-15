<template>
  <view class="content">
    <uni-nav-bar left-icon="back" @clickLeft="back" right-text="发布" @clickRight="_public" title="我的评价"></uni-nav-bar>
    <view class="splitCls"></view>
    <view class="goods-section">
      <view class="item">
        <view class="intro">
          <text>多功能环保除臭猫砂盆</text>
          <text class="size">规格:雾灰色</text>
        </view>
      </view>
      <view class="describe">
        <text>描述相符</text>
        <uni-rate value="5" size='20' margin="8" active-color="#F05237" @change="_starDescribe"></uni-rate>
      </view>
    </view>
    <view class="service">
      <text>对本次服务评分</text>
      <view class="attitude">
        <text>服务态度</text>
        <uni-rate value="5" size='20' margin="8" active-color="#F05237" @change="_starAttitude"></uni-rate>
      </view>
      <view class="skill">
        <text>服务技能</text>
        <uni-rate value="5" size='20' margin="8" active-color="#F05237" @change="_starSkill"></uni-rate>
      </view>
    </view>
    <textarea class="text-area" value="" v-model="evalute.textData" placeholder="请对这次服务做出评价(需要超过20个字才算有效评价)" />
  </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import uniRate from '@/components/uni-rate/uni-rate.vue'
import {mapState} from 'vuex';
export default {
  components: {uniNavBar,uniRate},
  data() {
    return {
      id:'',
      evalute:{
        stardes:'',
        staratt:'',
        starski:'',
        textData: ''
      }
    };
  },
  computed:{
    ...mapState(['token'])
  },
  onLoad(options) {
    console.log(options.id)
    this.id=options.id
  },

  methods: {
    back(){
      uni.navigateBack()
    },
    _public(){
      this.review()
    },
    review(){
      let evalute = this.evalute
      this.$http
        .post(`/addons/xshop/order/review`,{
          token:this.token,
          id:this.id,
          star:evalute.stardes || 5,
          server_attitude:evalute.staratt || 5,
          server_skill:evalute.starski || 5,
          content:evalute.textData
        } )
        .then(response => {
          const data = response.data;
          console.log('data', data);
          this.$api.msg(response.msg)
          if (response.code == 1) {
            uni.navigateBack({
            })
          }else{
          }
        })
    },
    _starDescribe(e){
      console.log(e)
      this.evalute.stardes = e.value
    },
    _starAttitude(e){
      this.staratt = e.value
    },
    _starSkill(e){
      this.starski = e.value
    }
  }
};
</script>

<style lang="scss">
@import 'mixin.scss';
page,.content{
  background-color: #fff;
  color: #333537;
}
// .uni-icons{
//   color: #EF5438 !important;
// }
.uni-icons{
  // color: #EF5438 !important;
}
.uni-nav-bar-right-text{
  color: #F05237;
  font-size: 26rpx;
}
.goods-section{
  width: 100%;
  padding-bottom: 40rpx;
  border-bottom: 1px solid #E8E8E8;
  .item{
    @include flexX;
    @include flexA;
    padding-top: 24rpx;
    .pic{
      width:172rpx;
      height:158rpx;
      margin-left: 30rpx;
      border-radius:6rpx;
    }
    .intro{
      @include flexY;
      @include flexJ;
      font-size: 28rpx;
      padding: 20rpx 30rpx;
      .size{
        color: #999999;
        margin-top: 15rpx;
      }
    }
  }
  .describe{
    @include flexX;
    @include flexA;
    padding-left: 34rpx;
    margin-top: 40rpx;
    >text{
      font-size:30rpx;
      margin-right:30rpx;
      margin-top: -13rpx;
    }
  }
}
.service{
  padding-left: 34rpx;
  margin-top: 40rpx;
  font-size:30rpx;
  .attitude,.skill{
    @include flexX;
    @include flexA;
    margin-top: 50rpx;
    >text{
      font-size:28rpx;
      margin-right:30rpx;
      margin-top: -13rpx;
    }
  }
}
.text-area{
  width:690rpx;
  margin: 40rpx auto;
  padding: 28rpx 20rpx;
  height:268rpx;
  background:rgba(242,242,242,1);
  border-radius:6rpx;
}
</style>
