<template>
	<view :style="showPage?'opacity: 1;':'opacity: 0;'">
		<scroll-view scroll-y="true" class="app-container" :style="'height:'+containerHeight+'px'">
			<view v-if="page=='store-index'" :class="page=='store-index'?'animation-fade':''">
				<cu-page-store-index></cu-page-store-index>
			</view>
			<view v-if="page=='classify'" :class="page=='classify'?'animation-fade':''">
				<cu-page-classify></cu-page-classify>
			</view>
			<view v-if="page=='all'" :class="page=='all'?'animation-fade':''">
				<cu-page-all></cu-page-all>
			</view>
			<view v-if="page=='activity'" :class="page=='activity'?'animation-fade':''">
				<!-- <cu-page-activity></cu-page-activity> -->
			</view>
		</scroll-view>
		<view id="tabbar" class="cu-bar tabbar">
			<view class="action tabbar-icon" :class="item.size=='big'?'big-icon':''" v-for="(item,index) in tabbar" :key="index" @tap="changeTab(item)">
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
		<view v-for="(item,index) in tabbar" :key="index" style="display: none;">
			<image :src="item.iconPath" mode=""></image>
			<image :src="item.selectedIconPath" mode=""></image>
		</view>
	</view>
</template>

<script>
	import {
		mapState,mapMutations
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
				tabbar:"tabbar",
        storeId:'storeId'
			})
		},
    onLoad(options) {
      this.page = 'store-index'
      console.log(this.page,options)
      if(options.store_id){
        this.setStoreId(options.store_id)
      }else{
        console.log('--!options.store_id--',options)
      }
      if(options.q){
        console.log('--options--',options)
        console.log('--options.q--',options.q)
        let code = decodeURIComponent(options.q).split('/store_id/')[1]
        console.log('---code',code)
        this.setStoreId(code)
      }
    },
    mounted() {
    	this.init_page_size()
    },
    onShareAppMessage() {
      var _this = this
      console.log('分享')
      // let store_id =options && options.store_id || this.storeId
      // console.log(store_id)
      this.$http
        .post(`/api/store/store/info`,{
          id:_this.storeId,
          token:_this.token || uni.getStorageSync('state_token') 
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            _this.storeInfo = data.store_info
            return {
            	title: _this.storeInfo.name,
            	path: `/pages/router-page/home?page="store-index"&store_id=${this.storeId}`,
            	imageUrl:_this.image ? _this.image : 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/app/share-logo@3.png'
            }
          }
        });
    },
		methods: {
      ...mapMutations(['setStoreId']),
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url){
				if(!this.hasLogin){
					url = '/pages/public/login';
				}
				uni.navigateTo({  
					url
				})  
			}, 
			changeTab(item) {
				uni.setNavigationBarTitle({
					title:item.title
				})
        console.log('this.page',item)
        if(item.page=='activity'){
          uni.switchTab({
            url:'/pages/mine/index'
          })
          return 
        }else{
          this.page = item.page;
        }
				// 可代替onshow去做一些业务逻辑
				// 因为数据全都在vuex 动态管理
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
