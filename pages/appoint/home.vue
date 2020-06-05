<template>
	<view :style="showPage?'opacity: 1;':'opacity: 0;'">
		<scroll-view scroll-y="true" class="app-container" :style="'height:'+containerHeight+'px'">
			<view v-if="page=='appoint-index'" :class="page=='appoint-index'?'animation-fade':''">
				<cu-page-appoint-index></cu-page-appoint-index>
			</view>
			<view v-if="page=='appoint-order'" :class="page=='appoint-order'?'animation-fade':''">
				<cu-page-appoint-order></cu-page-appoint-order>
			</view>
			<view v-if="page=='appoint-self'" :class="page=='appoint-self'?'animation-fade':''">
				<cu-page-appoint-self></cu-page-appoint-self>
			</view>
		</scroll-view>
		<view id="tabbar" class="cu-bar tabbar">
			<view class="action tabbar-icon" :class="item.size=='big'?'big-icon':''" v-for="(item,index) in appoint_tabbar" :key="index" @tap="changeTab(item)">
				<view >
					<image :class="page==item.page?'animation-scale-up':''" v-if="page==item.page" :src="item.selectedIconPath" mode=""></image>
					<image   v-else :src="item.iconPath" mode=""></image>
				</view>
				<text :style="'color: '+(page==item.page?tabbarAppointTextActiveColor:tabbarTextColor)+';'">
					{{item.title}}
				</text>
			</view>
		</view>
		<!-- 预加载所有tabbar 图标，以防点击的时候 闪一下 此处隐藏显示 -->
		<view v-for="(item,index) in appoint_tabbar" :key="index" style="display: none;">
			<image :src="item.iconPath" mode=""></image>
			<image :src="item.selectedIconPath" mode=""></image>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				page: '',
				showPage: false,
				containerHeight: 400,
			};
		},
		computed: {
			...mapState({
				tabbarTextColor: "tabbarTextColor",
				tabbarAppointTextActiveColor: "tabbarAppointTextActiveColor",
				appoint_tabbar:"appoint_tabbar",
        userInfo:"userInfo"
			})
		},
    onLoad(options) {
      this.page =options.page || 'appoint-index'
      // console.log('onload',options,'appoint/home')
    },
    mounted(options) {
    	this.init_page_size();
      // console.log(options)
      // if(options.page){
      //   this.page =options.page || 'appoint-index'
      //   console.log('mounted','appoint/home')
      // }
    },
		methods: {
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url){
				if(!this.userInfo.nickname){
          // #ifdef MP-WEIXIN
          let url = '/pages/login/login';
          uni.navigateTo({
            url
          }) 
          // #endif
          // #ifdef H5
          this.$common.authH5()
          // #endif
          return
				}
				// uni.navigateTo({  
				// 	url
				// })  
			}, 
			changeTab(item) {
         uni.setNavigationBarTitle({
         	title:item.title
         })
         this.page = item.page;
			},
			// 初始化内容区域的高度
			async init_page_size() {
				console.log("init_page_size")
				this.$nextTick(async () => {
					let sysInfo = uni.getSystemInfoSync();
					const query = uni.createSelectorQuery().in(this);
					const tabbarObj = query.select('#tabbar')
					let tabbarNodeRes = await this.syncBoundingClientRect(tabbarObj);
					let pageHeight = sysInfo.windowHeight - 50;
					this.containerHeight = pageHeight;
					this.showPage = true;
				})
			},
			syncBoundingClientRect(nodeobj) {
				return new Promise((resolve, reject) => {
					nodeobj.boundingClientRect(data => {
						console.log(data)
						resolve(data)
					}).exec();
				})
			}
		}
	}
</script>

<style lang="less">
  body,page,.container{
    background-color: #F7F9FB !important;
  }
	.app-container {
		min-height: 600upx;
		// background-color: #FFFFFF;
	}
  .tabbar{
    background-color: #FBFAFA;
  }
  .tabbar-icon{
		image{
			width: 48rpx;
			height: 48rpx;
		}
	}
	// .tabbar-icon.big-icon{
	// 	position: relative;
	// 	bottom: 20upx;
	// 	image{
	// 		width: 100upx;
	// 		height: 100upx;
	// 	}
	// }
</style>
