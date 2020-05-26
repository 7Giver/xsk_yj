<template>
  <view class="s-container">
    <view class="splitCls"></view>
    <view class="tui-coupon-item" v-for="(item, index) in collectList" :key="index">
      <view class="store-cover" @click="_toStore(item.store)">
        <image class="cover" :src="item.store.log_image_text" mode=""></image>
        <view class="tostore_text">进店</view>
      </view>
      <view class="center">
          <text class="name">{{ item.store.name }}</text>
          <view class="collect">{{ item.store.count_attention }}人收藏</view>
      </view>
      <button class="s-bg-linear btn" @click="_toggleAttention(item)">{{item.attention_text}}</button>
    </view>
    <uni-load-more v-if="loadmore" :status="loadingType"></uni-load-more>
    <empty setSrc="https://cdn.swh296.com/img/common/empty_content.png" v-if="isLoaded === true && collectList.length === 0"><view class="empty-text">暂无数据</view></empty>
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
      collectList:[],
      limit:10,
      page:1,
      loadingType:'loading',
      loadmore:false
    };
  },
  onLoad() {
    this.getCollectList()
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
    	this.getCollectList();
    },
    _toggleAttention(item){
      this.collectSwitch(item)
    },
    collectSwitch(item) {
      let status = item.attention_text == '取消关注' ?  0 : 1
      let id = item.store.id
      this.$http
        .post(`/api/store/collect/switch`, {
          store_id: id,
          status: status
        })
        .then(response => {
          const data = response.data;
          if (response.code == 1) {
            let attentionText = item.attention_text =='取消关注' ?  '关注' : '取消关注'
            this.$set(item,'attention_text',attentionText)
            this.$api.msg(response.msg);
          }
        });
    },
    _toStore(store) {
      this.setStoreId(store.id);
      uni.navigateTo({
        url: `/pages/router-page/home`
      });
    },
    getCollectList(){
      this.$http
        .post(`/api/store/collect/list`, {
          page:this.page
        })
        .then(response => {
          const resData = response.data;
          if (response.code === 1) {
            let data = resData.data
            data.map(s=>{
              s.attention_text = '取消关注'
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
              this.collectList = data
            }else {
              this.page ++
              if(data.length<this.limit){
                this.loadingType = 'noMore';
              }else{
                this.loadingType = 'more';
              }
              this.collectList = this.collectList.concat(data)
              this.loadmore = true
            }
            this.isisLoaded = true
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
      font-size: 28rpx;
      color: #333537;
    }
    .collect{
      font-size: 24rpx;
      color: #999999;
      margin-top: 12rpx;
    }
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
