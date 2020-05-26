<template>
</template>

<script>
</script>

<style>
</style>
<template>
  <view class="content">
    <view class="navbar" :style="{ position: headerPosition, top: headerTop }">
      <view class="nav-item" :class="{ current: filterIndex === 0 }" @click="tabClick(0)">综合</view>
      <view class="nav-item" :class="{ current: filterIndex === 1 }" @click="tabClick(1)">最新</view>
      <view class="nav-item" :class="{ current: filterIndex === 2 }" @click="tabClick(2)">
        <text>价格</text>
        <view class="p-box">
          <text :class="{ active: order === 'asc' && filterIndex === 2 }" class="yticon icon-shang"></text>
          <text :class="{ active: order === 'desc' && filterIndex === 2 }" class="yticon icon-shang xia"></text>
        </view>
      </view>
      <view class="nav-item" :class="{ current: filterIndex === 3 }" @click="tabClick(3)">
        <text>销量</text>
        <view class="p-box">
          <text :class="{ active: order === 'asc' && filterIndex === 3 }" class="yticon icon-shang"></text>
          <text :class="{ active: order === 'desc' && filterIndex === 3 }" class="yticon icon-shang xia"></text>
        </view>
      </view>
      <!-- <text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text> -->
    </view>
    <view class="store-list">
      <view class="item"  v-for="(item, index) in goodsList" :key="index" @click="navToDetailPage(item)">
        <image class="cover" :src="item.image[0]" mode=""></image>
        <view class="item-r">
          <view class="cont">{{ item.title }}</view>
          <view class="price">
            <text class="price-l">￥{{ item.price }}</text>
            <text class="price-cut" v-for="(s,index) in item.service_tags" :key="index">{{s}}</text>
          </view>
          <view class="discuss">
            <text>{{item.review_count}}评论</text>
            <text v-if="item.good_review">{{item.good_review}}好评</text>
          </view>
          <view class="enter">
            <text class="name">{{item.store.name}}</text>
            &nbsp;
            <view>
              进店
              <text class="yticon icon-you"></text>
            </view>
          </view>
          <image class="shop-car" @click.stop="_handleAddCart(item)" src="http://cdn.swh296.com/img/iconList/shop_car.png" mode=""></image>
        </view>
      </view>
    </view>
    <rf-loading v-if="loading"></rf-loading>
    <tui-toast ref="toast"></tui-toast>
    <!-- 空白页 -->
    <empty setSrc="https://cdn.swh296.com/img/common/empty_content.png" v-if="loaded === true && goodsList.length==0">
       <view class="empty-text">
         无相关内容
       </view>
     </empty>
  </view>
</template>

<script>
import {mapState} from 'vuex'
import empty from '@/components/empty';
import tuiToast from "@/components/ThorUI/toast/toast"
export default {
  components:{
    empty,
    tuiToast
  },
  data() {
    return {
      headerPosition: 'fixed',
      headerTop: '0px',
      filterIndex: 0,
      goodsList: [],
      productId:'',
      loaded:false,
      loading:true,
      page:1,
      limit:10,
      sort:'weigh',  //排序字段:weigh=权重,price=价格,new=新品,sold_count=销量
      order:'asc'   //顺序:desc=逆序,asc=正序
    };
  },
  computed:{
    ...mapState([
      'token',
      'userInfo'
    ])
  },
  onLoad(options) {
    this.productId = options.id
    this.getList()
  },
  onPageScroll(e) {
    //兼容iOS端下拉时顶部漂移
    if (e.scrollTop >= 0) {
      this.headerPosition = 'fixed';
    } else {
      this.headerPosition = 'absolute';
    }
  },
  methods: {
    _handleAddCart(item){
      if(!this.userInfo.mobile){
       // #ifdef MP-WEIXIN
       let url = '/pages/login/login';
       uni.navigateTo({
         url
       }) 
       // #endif
       // #ifdef H5
       this.$common.authH5()
       // #endif
      }else{
        this.xshopCart(item.skus[0])
      }
    },
    xshopCart(skus){
      let form = {
      	sku_id: skus.id,
      	quantity: 1
      }
      this.$http.post(`/addons/xshop/cart/add`,{
        token:this.token,
        quantity:form.quantity,
        sku_id:form.sku_id
      }).then(response => {
        const data = response.data;
        if (response.code === 1) {
          let params = {
          	title: "添加成功,在购物车等亲~",
          	imgUrl: "https://cdn.swh296.com/img/iconList/check-circle.png",
          	icon: true
          }
          this.$refs.toast.show(params)
          console.log('data',data)
        }else{
          this.$api.msg(response.msg)
        }
      });
    },
    getList(){
      this.$http
        .post(`/addons/xshop/product/getList`,{
          cat_id:this.productId,
          token:this.token,
          page:this.page,
          limit:this.limit,
          sort:this.sort,
          order:this.order
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            console.log('data',data)
            uni.hideLoading();
            this.goodsList = data.data
            this.loaded = true
            this.loading = false
            if(this.filterIndex === 2){
              if(this.order ==='asc'){
                this.goodsList.sort((a,b)=>b.price - a.price)
              }else{
                this.goodsList.sort((a,b)=>a.price - b.price)
              }
            }
            if(this.filterIndex === 3){
              if(this.order ==='asc'){
                this.goodsList.sort((a,b)=>b.sold_count - a.sold_count)
              }else{
                this.goodsList.sort((a,b)=>a.sold_count - b.sold_count)
              }
            }
          }
      })
    },
    //筛选点击
    tabClick(index) {
      if (this.filterIndex === index && index !== 2 && index !== 3) {
        return;
      }
      this.filterIndex = index;
      if(index === 0){
        this.sort = 'weigh' 
        this.order = 'asc' 
      }else if (index === 1){
        this.sort = 'new' 
        this.order = 'asc' 
      }else if (index ===2){
        this.sort = 'price'
        this.order = this.order === 'asc' ? 'desc': 'asc'
      }else if (index ===3){
        this.sort = 'sold_count'
        this.order = this.order === 'asc' ? 'desc': 'asc'
      }
      uni.pageScrollTo({
        duration: 300,
        scrollTop: 0
      });
      uni.showLoading({
        title: '正在加载'
      });
      this.getList()
    },
    //详情
    navToDetailPage(item) {
      //测试数据没有写id，用title代替
      let id = item.id;
      uni.navigateTo({
        url: `/pages/product/product?id=${id}`
      });
    },
    stopPrevent() {}
  }
};
</script>
<style lang="scss">
  page{
    background: #f6f6f6;
  }
</style>
<style lang="scss" scoped>
@import 'mixin.scss';
page,
.content,.app-container {
  height: 100%;
  background: #f6f6f6;
}
.navbar {
  position: fixed;
  left: 0;
  top: var(--window-top);
  display: flex;
  width: 100%;
  height: 80rpx;
  background: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.06);
  z-index: 10;
  .nav-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 30rpx;
    color: $font-color-dark;
    position: relative;
    &.current {
      color: $base-color;
      &:after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 120rpx;
        height: 0;
        border-bottom: 4rpx solid $base-color;
      }
    }
  }
  .p-box {
    display: flex;
    flex-direction: column;
    .yticon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30rpx;
      height: 14rpx;
      line-height: 1;
      margin-left: 4rpx;
      font-size: 26rpx;
      color: #888;
      &.active {
        color: $base-color;
      }
    }
    .xia {
      transform: scaleY(-1);
    }
  }
  .cate-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 80rpx;
    position: relative;
    font-size: 44rpx;
    &:after {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      border-left: 1px solid #ddd;
      width: 0;
      height: 36rpx;
    }
  }
}
.store-list {
  width: 710rpx;
  margin: 0 auto;
  background-color: #f6f6f6;
  margin-top: 100rpx;
  .item {
    width: 100%;
    position: relative;
    height: 236rpx;
    margin-bottom: 20rpx;
    background: rgba(255, 255, 255, 1);
    border-radius: 10rpx;
    @include flexX;
    @include flexA;
    .cover {
      width: 180rpx;
      height: 180rpx;
      border-radius: 6rpx;
      margin: 0 21rpx;
    }
    .item-r {
      color: #333537;
      font-size: 28rpx;
      flex: 1;
      @include flexY;
      .cont {
        @include two_txt_cut;
      }
      .price {
        width: 100%;
        margin: 5rpx auto;
        color: #f64443;
        @include flexX;
        @include flexA;
        .price-cut {
          font-size: 18rpx;
          margin-left: 24rpx;
          padding: 0 9rpx;
          height: 29rpx;
          line-height: 29rpx;
          background: rgba(9, 111, 208, 0);
          border: 1px solid rgba(246, 68, 67, 1);
          border-radius: 15rpx;
        }
      }
      .discuss {
        @include flexX;
        @include flexA;
        font-size: 20rpx;
        color: #999999;
        text{
          margin-right: 10rpx;
        }
      }
      .enter {
        width: 100%;
        margin: 3rpx auto;
        @include flexX;
        @include flexA;
        font-size: 20rpx;
        color: #999999;
        > view {
          margin-left: 10rpx;
          @include flexX;
          @include flexA;
          .icon-you {
            font-size: 13px;
            margin-top: 5rpx;
          }
        }
      }
      .shop-car {
        width: 46rpx;
        height: 46rpx;
        position: absolute;
        right: 20rpx;
        bottom: 20rpx;
      }
    }
  }
}
</style>
