<template>
  <view class="s-container">
    <view class="tui-coupon-item" v-for="(item, index) in favoriteList"  @click="_toProduct(item)" :key="index">
      <view class="store-cover">
        <image class="cover" :src="item.product.image[0]" mode=""></image>
        <!-- <view class="tostore_text">进店</view> -->
      </view>
      <view class="center">
          <view class="name clamp_two">{{ item.product.description }}</view>
          <view class="collect">{{ item.product.count_favorite }}人收藏</view>
      </view>
      <view class="price">
        ￥{{ item.product.price }}
      </view>
      <!-- <button class="s-bg-linear btn" @click="_toggleFavorite(item)">{{item.favorite_text}}</button> -->
    </view>
    <uni-load-more v-if="loadmore" :status="loadingType"></uni-load-more>
    <empty setSrc="https://cdn.swh296.com/img/common/empty_content.png" v-if="isLoaded === true && favoriteList.length === 0"><view class="empty-text">暂无数据</view></empty>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import empty from '@/components/empty';
export default {
  components: {
    empty
  },
  data() {
    return {
      isLoaded: false,
      favoriteList:[],
      limit:10,
      page:1,
      loadingType:'loading',
      loadmore:false
    };
  },
  onLoad() {
    this.favorite()
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
    	this.favorite();
    },
    _toggleFavorite(item){
      this.favoriteSwitch(item)
    },
    favoriteSwitch(item) {
      let state = item.favorite_text == '取消收藏' ?  0 : 1
      let id = item.product.id
      this.$http
        .post(`/addons/xshop/product/favorite`, {
          id: id,
          state: state
        })
        .then(response => {
          const data = response.data;
          if (response.code == 1) {
            let favoriteText = item.favorite_text == '取消收藏' ?  '收藏' : '取消收藏'
            this.$set(item,'favorite_text',favoriteText)
            this.$api.msg(response.msg);
          }
        });
    },
    _toProduct(item){
      let id = item.product.id
      uni.navigateTo({
        url: `/pages/product/product?id=${id}`
      })
    },
    favorite(){
      this.$http
        .post(`/addons/xshop/user/favorite`, {
          page:this.page
        })
        .then(response => {
          const resData = response.data;
          if (response.code === 1) {
            let data = resData.data
            data.map(s=>{
              s.favorite_text = '取消收藏'
            })
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
              this.favoriteList = data
            }else {
              this.page ++
              if(data.length<this.limit){
                this.loadingType = 'noMore';
              }else{
                this.loadingType = 'more';
              }
              this.favoriteList = this.favoriteList.concat(data)
              this.loadmore = true
            }
            this.isLoaded = true
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'mixin.scss';
page {
  // background: #f5f5f5;
  background: #fff;
}
.tui-coupon-list {
  width: 100%;
  // margin: 0 25rpx;
  box-sizing: border-box;
}
.tui-coupon-item {
  // width: 688rpx;
  margin: 0 30rpx;
  // margin: 0rpx auto;
  height: 178rpx;
  background: rgba(255, 255, 255, 1);
  // border-radius: 24rpx;
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  border-bottom: 1px solid #e6e6e6;

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
    @include flexY;
    .name{
      width: 95%;
      font-size: 28rpx;
      color: #333537;
    }
    .collect{
      font-size: 24rpx;
      color: #999999;
      margin-top: 12rpx;
    }
  }
  .price{
    font-size:28rpx;
    margin-right: 20rpx;
    color: #F64443;
  }
  .btn {
    margin-right: 20rpx;
    width: 140rpx;
    height: 54rpx;
    border-radius: 27rpx;
    color: #F15F47;
    font-size: 22rpx;
    padding: 0;
    background:rgba(240,240,240,1);
  }
}
</style>
