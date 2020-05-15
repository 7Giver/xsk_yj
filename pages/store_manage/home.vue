<template>
	<view :style="showPage?'opacity: 1;':'opacity: 0;'">
		<scroll-view scroll-y="true" class="app-container" :style="'height:'+containerHeight+'px'">
			<view v-if="page=='manage-index'" :class="page=='manage-index'?'animation-fade':''">
				<cu-page-manage-index></cu-page-manage-index>
			</view>
			<view v-if="page=='manage-order'" :class="page=='manage-order'?'animation-fade':''">
				<cu-page-manage-order></cu-page-manage-order>
			</view>
			<view v-if="page=='manage-goods'" :class="page=='manage-goods'?'animation-fade':''">
				<cu-page-manage-goods></cu-page-manage-goods>
			</view>
			<view v-if="page=='manage-statistics'" :class="page=='manage-statistics'?'animation-fade':''">
				<cu-page-manage-statistics></cu-page-manage-statistics>
			</view>
		</scroll-view>
		<view id="tabbar" class="cu-bar tabbar">
			<view class="action tabbar-icon" :class="item.size=='big'?'big-icon':''" v-for="(item,index) in manage_tabbar" :key="index" @tap="changeTab(item)">
				<view >
					<image :class="page==item.page?'animation-scale-up':''" v-if="page==item.page" :src="item.selectedIconPath" mode=""></image>
					<image   v-else :src="item.iconPath" mode=""></image>
				</view>
				<text :style="'color: '+(page==item.page?tabbarTextActiveColor:tabbarTextColor)+';'">
					{{item.title}}
				</text>
			</view>
		</view>
		<!-- 预加载所有tabbar 图标，以防点击的时候 闪一下 此处隐藏显示 -->
		<view v-for="(item,index) in manage_tabbar" :key="index" style="display: none;">
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
				tabbarTextActiveColor: "tabbarTextActiveColor",
				manage_tabbar:"manage_tabbar",
        userInfo:"userInfo"
			})
		},
    onLoad(options) {
      this.page =options.page || 'manage-index'
      console.log('onload',this.page,options,this.userInfo)
    },
    mounted(options) {
    	this.init_page_size();
      console.log('mounted',this.userInfo)
    },
		methods: {
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url){
				if(!this.userInfo.nickname){
					let url = '/pages/login/login'
          uni.navigateTo({
          	url
          }) 
          return
				}
				// uni.navigateTo({  
				// 	url
				// })  
			}, 
			changeTab(item) {
        // this.navTo()
        console.log('item',item)
        if(!this.userInfo.nickname){
          let url = '/pages/login/login'
          uni.navigateTo({
          	url
          }) 
        }else{
         uni.setNavigationBarTitle({
         	title:item.title
         })
         this.page = item.page; 
        }
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
