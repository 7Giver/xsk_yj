<template>
	<view class="container">
    <view class="type-section">
      <view class="item" v-for="(item,index) in typeList" @click="_gType(item)" :key="index">
        <image :src="item.image" mode=""></image>
      </view>
    </view>
	
	</view>
</template>

<script>
  import {mapState} from 'vuex'
	export default {
		data() {
			return {
				typeList:[
          // {
          //   src:'http://cdn.swh296.com/img/activity/banner_ser.png',
          //   text:'生活服务'
          // },
          // {
          //   src:'http://cdn.swh296.com/img/activity/banner_room.png',
          //   text:'床上用品'
          // },
          // {
          //   src:'http://cdn.swh296.com/img/activity/banner_huwai.png',
          //   text:'户外活动'
          // },
          // {
          //   src:'http://cdn.swh296.com/img/activity/banner_child.png',
          //   text:'儿童用品'
          // }
        ]
			};
		},
		computed:{
    ...mapState([
      'token'
    ])
		},
    created() {
      this.xshop()
    },
		methods: {
      xshop() {
        this.$http.post(`/addons/xshop/category/index`,{
          token:this.token
        }).then(response => {
          const data = response.data;
          if (response.code === 1) {
            console.log('data',data)
            this.typeList = data
          }
        });
      },
		_gType(item){
      uni.navigateTo({
        url:`/pages/router-page/product-list?id=${item.id}`
      })
    }
		}
	}
</script>

<style lang="scss" scoped>
 page,.container{
   .type-section{
     width: 100%;
     padding-top: 22rpx;
     .item{
       width: 690rpx;
       height: 220rpx;
       margin:0 auto 22rpx;
       image{
         width: 690rpx;
         height: 220rpx;
       }
     }
   }
 } 
</style>
