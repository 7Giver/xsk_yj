<template>
  <view class="container">
    <view class="item" v-for="(item, index) in manageList" @click="_gManageList(item)" :key="index">
      <image :src="item.image" mode=""></image>
      <text>{{ item.text }}</text>
    </view>
  </view>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
export default {
	data() {
		return {
			manageList:[
         {
           image:'http://cdn.swh296.com/img/store-manage/store_add.png',
           text:'新增商品',
           url:'/pages/store_manage_comp/new_goods'
         },
         {
           image:'http://cdn.swh296.com/img/store-manage/store_goods.png',
           text:'商品管理',
           url:`/pages/store_manage_comp/self_goods_manage`
         },
         {
           image:'http://cdn.swh296.com/img/store-manage/store_card.png',
           text:'卡券管理',
           url:'/pages/store_manage_comp/card_manage'
         },
         {
           image:'/static/store_edit.png',
           text:'编辑商品',
           url:'/pages/store_manage_comp/self_goods_manage'
         }
         // {
         //   image:'http://cdn.swh296.com/img/store-manage/store_score.png',
         //   text:'积分商品管理',
         //   url:'/pages/store_manage_comp/score_manage'
         // },
         // {
         //   image:'http://cdn.swh296.com/img/store-manage/store_yjb.png',
         //   text:'营家币管理'
         // }
       ]
		}
	},
  computed: {
    ...mapState(['userInfo'])
  },
  mounted() {
    if(!this.userInfo.nickname){
       this.setUserInfo(uni.getStorageSync('state_userInfo'))
    }
  },
	methods: {
    ...mapMutations(['setUserInfo']),
    navTo(url){
      if(!this.userInfo.nickname){
      	url = '/pages/login/login'
      }
      uni.navigateTo({  
      	url
      })  
    },
		_gManageList(item){
        this.navTo(item.url)
     }
	}
}
</script>

<style lang="scss" scoped>
@import 'mixin.scss';
.container {
  width: 100%;
  @include flexX;
  flex-wrap: wrap;
  padding-top: 20rpx;
  .item {
    @include flexY;
    @include flexJ;
    width: 218rpx; //654  750 96 /4 24
    margin-left: 24rpx;
    margin-bottom: 20rpx;
    height: 188rpx;
    position: relative;
    image {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
    text {
      margin-top: 50%;
      position: relative;
      text-align: center;
      font-size: 24rpx;
    }
  }
}
</style>
