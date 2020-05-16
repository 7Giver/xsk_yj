<template>
  <view class="container">
    <view class="search-box">
     <image src="http://cdn.swh296.com/img/iconList/search.png" class="search" mode=""></image>
     <input type="text" v-model="defaultKeyword" @input="inputChange" value="" />
     <image src="http://cdn.swh296.com/img/iconList/delete.png" v-if="defaultKeyword" @click="_delete" class="close" mode=""></image>
    </view> 
    <view class="splitCls"></view>
    <!-- 空白页 -->
  <empty setSrc="https://cdn.swh296.com/img/common/empty_content.png" v-if="loaded === true && (!(searchStore.store &&searchStore.store.name) && searchStore.product_list.total==0)">
      <view class="empty-text">
        无相关内容
      </view>
    </empty>
    <scroll-view
      enable-back-to-top="true"
      :style="{height:height}"
    	class="list-scroll-content" 
      @scrolltolower="search"
    	scroll-y
      v-if="searchList.length>0"
    >
      <view class="store-list" v-if="searchStore.product_list.total>0">
        <view class="item" v-for="(item,index) in searchList" @click="_gStoreDetail(item)" :key="index">
          <image class="cover" :src="item.image[0]" mode=""></image>
          <view class="item-r">
            <view class="cont">{{item.title}}</view>
            <view class="price">
              <text class="price-l">￥{{item.price}}</text>
              <text class="price-cut" v-for="(s,index) in item.service_tags" :key="s">{{s}}</text>
            </view>
            <view class="discuss">
              <text>{{item.review_count}}评论</text>
              <text v-if="item.good_review">{{item.good_review}}好评</text>
            </view>
            <view class="enter">
              <text class="name">{{item.store.name}}</text>&nbsp;
              <view>进店 <text class="yticon icon-you"></text></text>
            </view>
            <!-- <image class="shop-car" src="http://cdn.swh296.com/img/iconList/shop_car.png" mode=""></image> -->
            </view>
          </view>
        </view>
      </view>
      <uni-load-more :status="loadingType"></uni-load-more>
    </scroll-view>
    <rf-loading v-if="loading"></rf-loading>
  </view>
</template>

<script>
  import mSearch from '@/components/rf-search/rf-search';
  import empty from "@/components/empty";
  import {
        mapMutations  
    } from 'vuex';
  
  let timer = null
  export default {
    components:{
      mSearch,
      empty
    },
    data(){
      return{
        defaultKeyword: '',
        keyword: '',
        searchStore:{},
        storeList:[
        ],
        page:1,
        loaded:false,
        loading:true,
        loadingType:'loading',
        height:'700',
        searchList:[],
        limit:10,
        id:''
      }
    },
    onLoad(e) {
      let windowHeight = uni.getSystemInfoSync().windowHeight;
      this.height = windowHeight - 60 + 'px';
      console.log(e)
      this.defaultKeyword = e.keyword
      this.id = e.id
      this.search()
    },
    methods:{
      ...mapMutations(['setStoreId']),
      _gStoreDetail(item){
        uni.navigateTo({
          url: `/pages/product/product?id=${item.id}`
        })
      },
      _delete(){
         this.defaultKeyword =''
      },
      search(){
        this.$http
          .post(`/api/search/index`,{
            page:this.page,
            limit:this.limit,
            keywords:this.defaultKeyword,
            store_id:this.id
          })
          .then(response => {
            const data = response.data;
            uni.hideLoading()
            this.loading = false
            if (response.code === 1) {
              let product_list = data.product_list.data
              this.loaded = true
              this.searchStore = data
               uni.hideLoading()
               this.loading = false;
                 if(this.page == 1){
                   if(product_list.length<this.limit){
                     this.loadingType = 'noMore'
                   }else{
                     this.loadingType = 'more'
                     this.page ++
                   }
                   this.searchList = product_list
                 }else {
                   this.page ++
                   if(product_list.length<this.limit){
                     this.loadingType = 'noMore';
                   }else{
                     this.loadingType = 'more';
                   }
                   this.searchList = this.searchList.concat(product_list)
                 }
                 this.isLoaded = true
             }
             
          });
      },
      inputChange(e){
        if (timer) clearInterval(timer)
          timer = setTimeout(() => {
            uni.showLoading({
              title:'加载中...'
            })
            this.search(e.detail.value)
          }, 800)
      }
    }
  }
</script>
<style>
  page{
    height: 100%;
    background-color: #F5F5F5 !important;
  }
</style>
<style lang="scss" scoped>
  @import 'mixin.scss';
  .container{
    height: 100%;
    background-color: #F5F5F5;
    padding-top: 15rpx;
    .list-scroll-content{
      width: 100%;
      height: 1000px;
      // margin-top: 5rpx;
    }
    .empty-content{
      // top: 80rpx;
      padding-bottom: 0;
    }
   .search-box{
     // position: fixed;
     width:690rpx;
     margin: 0rpx auto 0;
     // top: 15rpx;
     left: 30rpx;
     height:66rpx;
     background:rgba(255,255,255,1);
     border:2px solid rgba(234, 84, 62, 1);
     border-radius:33px;
     @include flexX;
     @include flexA;
     .close,.search{
       width: 34rpx;
       height: 34rpx;
     }
     .search{
       margin:0 20rpx;
     }
     .close{
       margin:0 20rpx 0 40rpx;
     }
     input{
       flex: 1;
     }
   } 
   .store{
     width:690rpx;
     margin: 21rpx auto;
     padding: 0 21rpx;
     @include flexSB;
     height:130rpx;
     background:rgba(255,255,255,1);
     border:1px solid rgba(227, 226, 225, 1);
     border-radius:14rpx;
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
       width:145rpx;
       margin: 0;
       height:52rpx;
       line-height: 52rpx;
       background:rgba(240,240,240,1);
       border-radius:26rpx;
       font-size:28rpx;
       color: #EA543E;
       // &::after{
       //   border: none;
       // }
     }
   }
   .store-list{
     width:710rpx;
     margin: 0 auto;
     background-color: #fff;
     .item{
       width: 100%;
       position: relative;
       height:236rpx;
       background:rgba(255,255,255,1);
       border-radius:10rpx;
       @include flexX;
       @include flexA;
       .cover{
         width:180rpx;
         height:180rpx;
         border-radius:6rpx;
         margin: 0 21rpx;
       }
       .item-r{
         color: #333537;
         font-size: 28rpx;
         flex:  1;
         @include flexY;
         .cont{
           @include two_txt_cut;
           
         }
         .price{
           width: 100%;
           margin: 5rpx auto;
           color: #F64443;
           @include flexX;
           @include flexA;
           .price-cut{
             font-size: 18rpx;
             margin-left: 24rpx;
             padding: 0 9rpx;
             height:29rpx;
             line-height: 29rpx;
             background:rgba(9,111,208,0);
             border:1px solid rgba(246, 68, 67, 1);
             border-radius:15rpx;
           }
         }
         .discuss{
           @include flexX;
           @include flexA;
           font-size: 20rpx;
           color: #999999;
           text{
             margin-right: 10rpx;
           }
         }
         .enter{
          width: 100%;
          margin: 3rpx auto;
          @include flexX;
          @include flexA;
          font-size: 20rpx;
          color: #999999;
          >view{
            // margin-left: 10rpx;
            @include flexX;
            @include flexA;
            .icon-you{
              font-size: 13px;
              margin-top: 5rpx;
            }
          }
         }
         .shop-car{
           width: 46rpx;
           height: 46rpx;
           position: absolute;
           right: 20rpx;
           bottom: 20rpx;
         }
       }
     }
    
   }
  }
</style>
