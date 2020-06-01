<template>
  <view class="s-container">
    <view class="tui-coupon-item tui-top20" v-if="isShow" v-for="(item, index) in couponData" :key="index">
      <view class="store-cover" @click="_toStore(item.store)">
        <image class="cover" :src="item.store.log_image_text" mode=""></image>
        <view class="tostore_text">进店</view>
      </view>
      <view class="center">
        <view class="center-t">
      
          <view class="price-inner">
            <text class="price" v-if="item.code==0">￥{{item.money}}</text>
            <text class="price" v-else>{{item.name}}</text>
            <text class="cut" v-if="item.order_min_amount>0">满{{item.order_min_amount}}-{{item.money}}</text>
          </view>
          <view class="store-name">
            {{item.store.name}}
          </view>
          <view class="type">
            {{item.desc}}
          </view>
        </view>
      <!--  <view class="time">
          {{item.store.name}}
        </view> -->
        <view class="time">
          {{item.use_start_time_text}} - {{item.use_end_time_text}}
        </view>  
      </view>
      <button class="s-bg-linear" @click="_togetCoupon(item)" :class="[item.coupon_text=='已领取' ?'is_get':'']">{{item.coupon_text}}</button>
    </view>
    <empty setSrc="https://cdn.swh296.com/img/common/empty_content.png" v-if="loaded === true && couponData.length === 0">
      <view class="empty-text">
        暂无可领取优惠券
      </view>
    </empty>
  </view>
</template>

<script>
import { mapState,mapMutations} from 'vuex';
import empty from '@/components/empty';
import sModal from '../../components/s_modal.vue';
export default {
  components:{
    sModal,
    empty
  },
  data() {
    return {
      couponData:[],
      isShowCodeModal:false,
      couponExchange:{},
      code:'',
      loaded:false,
      isShow:true
    }
  },
  onLoad() {
    this.homeCoupons()
  },
  computed: {
    ...mapState(['token'])
  },
  methods: {
    ...mapMutations({
      setStoreId:'setStoreId'
    }),
    _toStore(store){
      this.setStoreId(store.id)
      uni.navigateTo({
        url:`/pages/router-page/home`
      })
    },
    _togetCoupon(item){
      this.addCoupon(item)
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
            this.$api.msg('领取成功,请到个人中心卡券列表中查看~')
            this.isShow =false
            this.isShow =true
            this.$set(item,'coupon_text','已领取')
          }else{
            this.$api.msg(response.msg)
          }
        })
    },
    _copy(){
      uni.setClipboardData({
          data: this.code,
          success: function () {
              uni.getClipboardData({
                  success: function (res) {
                      console.log(res.data);
                  }
              });
          }
      });
    },
    _getCode(item){
      this.couponExchange =item
      this.code = item.code
      // this.couponData = item
      this.isShowCodeModal = true
    },
    //优惠券列表
    homeCoupons() {
      this.$http
        .post(`/addons/xshopcoupon/coupon/homeCoupons`)
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            console.log('data',data)
            this.loaded = true
            this.couponData = data
            data.forEach(v=>{
              v.coupon_text = '领取优惠券'
            })
          }
        })
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'mixin.scss';  
page {
  background: #f5f5f5;
}

/deep/.codeModal{
  width:520rpx;
  padding: 45rpx 32rpx;
  background:rgba(255,255,255,1);
  border-radius:10rpx;
  color: #999999;
  font-size: 26rpx;
  z-index: 8;
  top: 24%;
  .title{
    width: 100%;
    text-align: center;
    color: #333537;
    font-size: 32rpx;
  }
  .copy{
    margin-top: 30rpx;
    color: #4287E4;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    .code{
      color: #F15F47;
      font-size: 30rpx;
    }
    view{
      margin-left: 30rpx;
    }
  }
  .content{
    .item{
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
  width:688rpx;
  padding: 0 20rpx;
  margin: 20rpx auto 0;
  height:178rpx;
  background:rgba(255,255,255,1);
  border-radius:24rpx;
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
    .s-bg-linear{
      position: absolute;
      right: 20rpx;
      bottom: 40rpx;
      width: 140rpx;
      height: 54rpx;
      border-radius:27rpx;
      color: #fff;
      font-size: 22rpx;
      padding: 0;
      &.is_get{
        background-color: #999;
        color: #fff;
      }
  }
  .store-cover{
    width:126rpx;
    height:126rpx;
    border-radius: 14rpx;
    position: relative;
    margin-right: 15rpx;
    .cover{
      width:126rpx;
      height:126rpx;
      border-radius: 14rpx;
    }
   .tostore_text{
     position: absolute;
     width: 100%;
     height:40rpx;
     background:rgba(0,0,0,.5);
     line-height: 40rpx;
     text-align: center;
     left: 0;
     bottom: 0;
     font-size: 26rpx;
     color: #fff;
     border-radius:0 0 14rpx 14rpx;
   } 
  }
  .center{
    flex:1;
     // height:126rpx;
    @include flexY;
    justify-content: space-between;
    .center-t{
      color: #F64443;
      font-size: 22rpx;
      @include flexY;
      .price-inner{
        font-size: 30rpx;
        .price{
          margin-right: 9rpx;
        }
        .cut{
          font-size: 22rpx;
        }
      }
      .type{
        // margin-top: 6rpx;
         color: #666666;
         font-size: 24rpx;
      }
      .store-name{
        color: #333;
        font-size: 24rpx;
      }
    }
    // .store
    .time{
      color: #999999;
      font-size: 20rpx;
    }
  }
}
</style>
