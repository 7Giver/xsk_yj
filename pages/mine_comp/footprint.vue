<template>
  <view class="s-container">
    <view class="tui-coupon-item" v-for="(item, index) in footprintList" :key="index">
      <view class="time" v-if="item.list">
        {{item.time}}
      </view>
      <view class="list">
        <view class="item" v-for="(s,sIndex) in item.list" :key="sIndex">
          <image v-if="s.product" :src="s.product.image[0]" mode=""></image>
          <view class="price-inner" v-if="s.product">
             <text>￥{{s.product.price}}</text>
             <view class="idot">
               <text></text>
               <text></text>
               <text></text>
             </view>
           </view>
        </view>
      </view>
    </view>
    <uni-load-more v-if="loadmore" :status="loadingType"></uni-load-more>
    <empty setSrc="https://cdn.swh296.com/img/common/empty_content.png" v-if="isLoaded === true && footprintList.length === 0"><view class="empty-text">暂无数据</view></empty>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import empty from '@/components/empty';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
  components: {
    empty,
    uniLoadMore
  },
  data() {
    return {
      isLoaded: false,
      footprintList:[],
      limit:18,
      page:1,
      loadingType:'loading',
      loadmore:false
    };
  },
  onLoad() {
    this.getviewList()
  },
  computed: {
    ...mapState(['token','userInfo'])
  },
  methods: {
    ...mapMutations({
      setStoreId: 'setStoreId'
    }),
    //加载更多
    onReachBottom(){
    	this.getviewList();
    },
    _toStore(store) {
      this.setStoreId(store.id);
      uni.navigateTo({
        url: `/pages/router-page/home`
      });
    },
    getviewList(){
      this.$http
        .post(`/addons/xshop/user/viewList1`, {
          page:this.page,
          limit:this.limit
        })
        .then(response => {
          const resData = response.data;
          if (response.code === 1) {
            let data = resData.data
            console.log('data',data)
            let len=0 
            data.forEach(v=>{
                len +=v.list.length
            })
            console.log(len)
            if(this.page == 1){
              if(len<this.limit){
                if(len ==0) {
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
              this.footprintList = data
            }else {
              this.page ++
              if(len<this.limit){
                this.loadingType = 'noMore';
              }else{
                this.loadingType = 'more';
              }
              this.footprintList = this.footprintList.concat(...data)
              console.log('foot',data,this.footprintList)
              this.loadmore = true
            }
            this.isisLoaded = true
          }
        })
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'mixin.scss';
page {
  background: #F5F5F4;
}
.tui-coupon-item {
  margin-top: 20rpx;
  background: rgba(255, 255, 255, 1);
  position: relative;
  .time{
    height: 60rpx;
    line-height: 60rpx;
    padding-left: 20rpx;
    background: #F5F5F4;
  }
  .list{
    width: 100%;
    padding-top: 20rpx;
    display: flex;
    flex-wrap: wrap;
    .item{
      width: 250rpx;
      image{
        width:250rpx;
        height:250rpx;
      }
      .price-inner{
        width: 100%;
        height: 50rpx;
        @include flexSB;
        font-size: 24rpx;
        color: #FF3D1F;
        .idot{
          width: 50rpx;
          margin-right: 10rpx;
          height: 50rpx;
          @include flexSB;
          text{
            width: 10rpx;
            height: 10rpx;
            background-color: #CCCCCC;
            border-radius: 5rpx;
          }
        }
      }
    }
  }
}
</style>
