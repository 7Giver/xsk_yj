<template>
	<view class="content">
		<view class="navbar">
			<view 
				v-for="(item, index) in navList" :key="index" 
				class="nav-item" 
				:class="{current: tabCurrentIndex === index}"
				@click="tabClick(index)"
			>
				{{item.text}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" :style="{height:height}" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view 
					class="list-scroll-content" 
					scroll-y
					@scrolltolower="loadData"
				>
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
					
					<!-- 订单列表 -->
					<view 
						v-for="(item,index) in tabItem.orderList" :key="index"
						class="order-item"
					>
						<view class="i-top b-b">
							<text class="store-name">{{item.time}}</text>
							<text class="state" :style="{color: item.stateTipColor}">{{item.stateTip}}</text>
							<text 
								v-if="item.state===9" 
								class="del-btn yticon icon-iconfontshanchu1"
								@click="deleteOrder(index)"
							></text>
						</view>
						<scroll-view v-if="item.goodsList.length > 1" class="goods-box" scroll-x>
							<view
								v-for="(goodsItem, goodsIndex) in item.goodsList" :key="goodsIndex"
								class="goods-item"
							>
								<image class="goods-img" :src="goodsItem.image" mode="aspectFill"></image>
							</view>
						</scroll-view>
						<view 
							v-if="item.goodsList.length === 1" 
							class="goods-box-single"
							v-for="(goodsItem, goodsIndex) in item.goodsList" :key="goodsIndex"
						>
              <view class="t-cont">
                <image class="goods-img" :src="goodsItem.image" mode="aspectFill"></image>
                <view class="center">
                  <text class="title clamp">{{goodsItem.title}}</text>
                  <text class="attr-box">规格:{{goodsItem.attr}} </text>
                </view>
                <view class="right">
                	<text class="price">{{goodsItem.price}}</text>
                  <text class="num">x{{goodsItem.number}}</text>
                </view>
              </view>
              <view class="action-box">
               <view class="total-num">
                  <text class="num-l">总计:￥ {{goodsItem.number}}</text>
                  <text class="num-freight">包含运费: 0.00</text>
                </view>
                <view class="button-cont">
                  <!-- <button class="action-btn" @click="cancelOrder(item)">取消订单</button> -->
                  <button class="action-btn fahuo">立即支付</button>
                </view>
              </view>
						</view>
					</view>
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template> 

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import Json from '@/Json';
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				tabCurrentIndex: 0,
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '待发货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '待收货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 3,
						text: '已完成',
						loadingType: 'more',
						orderList: []
					}
				],
        height:''
			};
		},
		
		onLoad(options){
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			this.tabCurrentIndex = +options.state || 0;
			// #ifndef MP
			this.loadData()
			// #endif
			// #ifdef MP
			// if(options.state == 0){
				this.loadData()
			// }
			// #endif
			
		},
		 created(){
       console.log('...',)
      this.height = uni.getSystemInfoSync().windowHeight - 90 +'px'
		 	this.tabCurrentIndex = 0;
		 	this.loadData()
		 },
		methods: {
			//获取订单列表
			loadData(source){
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let state = navItem.state;
				
				if(source === 'tabChange' && navItem.loaded === true){
					//tab切换只有第一次需要加载数据
					return;
				}
				if(navItem.loadingType === 'loading'){
					//防止重复加载
					return;
				}
				
				navItem.loadingType = 'loading';
				
				setTimeout(()=>{
					let orderList = Json.orderList.filter(item=>{
						//添加不同状态下订单的表现形式
						item = Object.assign(item, this.orderStateExp(item.state));
						//演示数据所以自己进行状态筛选
						if(state === 0){
							//0为全部订单
							return item;
						}
						return item.state === state
					});
					orderList.forEach(item=>{
						navItem.orderList.push(item);
					})
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					this.$set(navItem, 'loaded', true);
					
					//判断是否还有数据， 有改为 more， 没有改为noMore 
					navItem.loadingType = 'more';
				}, 600);	
			}, 

			//swiper 切换
			changeTab(e){
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
			},
			//删除订单
			deleteOrder(index){
				uni.showLoading({
					title: '请稍后'
				})
				setTimeout(()=>{
					this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
					uni.hideLoading();
				}, 600)
			},
			//取消订单
			cancelOrder(item){
				uni.showLoading({
					title: '请稍后'
				})
				setTimeout(()=>{
					let {stateTip, stateTipColor} = this.orderStateExp(9);
					item = Object.assign(item, {
						state: 9,
						stateTip, 
						stateTipColor
					})
					
					//取消订单后删除待付款中该项
					let list = this.navList[1].orderList;
					let index = list.findIndex(val=>val.id === item.id);
					index !== -1 && list.splice(index, 1);
					
					uni.hideLoading();
				}, 600)
			},

			//订单状态文字和颜色
			orderStateExp(state){
				let stateTip = '',
					stateTipColor = '#fa436a';
				switch(+state){
					case 1:
						stateTip = '待付款'; break;
					case 2:
						stateTip = '待发货'; break;
					case 9:
						stateTip = '订单已关闭'; 
						stateTipColor = '#909399';
						break;
						
					//更多自定义
				}
				return {stateTip, stateTipColor};
			}
		},
	}
</script>

<style lang="scss">
  @import 'mixin.scss';
	page, .content{
		background: $page-color-base;
		// height: 100%;
		height: 500px;
	}
	
	.swiper-box{
		// height: calc(100% - 40px);
		// height: 600px;
	}
	.list-scroll-content{
		height: 100%;
	}
	
	.navbar{
		display: flex;
		height: 40px;
		padding: 0 50rpx;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: relative;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 30px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item{
		height: auto;
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding-left: 30rpx;
		background: #fff;
		margin-top: 16rpx;
		.i-top{
			display: flex;
			align-items: center;
			height: 80rpx;
			padding-right:30rpx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.store-name{
        color: #333537;
        font-size:28rpx;
				flex: 1;
			}
			.state{
				color: $base-color;
			}
			.del-btn{
				padding: 10rpx 0 10rpx 36rpx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30rpx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20rpx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		/* 多条商品 */
		.goods-box{
			height: 160rpx;
			padding: 20rpx 0;
			white-space: nowrap;
			.goods-item{
				width: 120rpx;
				height: 120rpx;
				display: inline-block;
				margin-right: 24rpx;
			}
			.goods-img{
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		/* 单条商品 */
		.goods-box-single{
      padding-top: 20rpx;
      .t-cont{
        display: flex;
        padding-bottom: 25rpx;
        border-bottom: 1px solid #E8E8E8;
      }
			.goods-img{
				display: block;
				width: 120rpx;
				height: 120rpx;
			}
      .center{
        flex: 1;
        margin: 0 20rpx;
        overflow: hidden;
        @include flexY;
        @include flexJ;
         .title{
          font-size: $font-base + 2rpx;
          color: $font-color-dark;
          line-height: 1;
         }
         .attr-box{
          font-size: $font-sm + 2rpx;
          color: $font-color-light;
          padding: 10rpx 0rpx;
         }
      }
			.right{
			 @include flexY;
			 @include flexJ;
        justify-content: center;
				padding: 0 30rpx 0 0rpx;
				overflow: hidden;
				.price{
					font-size: $font-base + 2rpx;
					color: $font-color-dark;
					&:before{
						content: '￥';
						font-size: $font-sm;
						margin: 0 2rpx 0 8rpx;
					}
				}
        .num{
          text-align: right;
        }
			}
		}
		
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20rpx 30rpx;
			font-size: $font-sm + 2rpx;
			color: $font-color-light;
			.num{
				margin: 0 8rpx;
				color: $font-color-dark;
			}
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
				&:before{
					content: '￥';
					font-size: $font-sm;
					margin: 0 2rpx 0 8rpx;
				}
			}
		}
		.action-box{
			// @include flexSB;
			height: 100rpx;
			position: relative;
			padding-right: 30rpx;
      .total-num{
        float: left;
        height: 100%;
        @include flexX;
        .num-l{
          color: #333537;
          font-size: 28rpx;
          margin-right:14rpx;
        }
        .num-freight{
          color: #999999;
          font-size: 24rpx;
        }
      }
      .button-cont{
        float: right;
        margin-top: 22rpx;
        .action-btn{
        	width: 136rpx;
        	height: 56rpx;
        	margin: 0;
        	margin-left: 24rpx;
        	padding: 0;
        	text-align: center;
        	line-height: 56rpx;
        	font-size: $font-sm + 2rpx;
        	border-radius: 14rpx;
          // 提醒发货 确认收货 去付款
        	&.fahuo{
            background:linear-gradient(-90deg,rgba(242,106,83,1) 0%,rgba(238,67,39,1) 100%);
        		color: #fff;
        	}
          &.look{
            background:linear-gradient(-90deg,rgba(242,106,83,1) 0%,rgba(238,67,39,1) 100%);
            color: #F0573D;
          }
        }
      }
    
		}
	}
	
	
	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80rpx;
		align-items: center;
		justify-content: center
	}
	
	.uni-load-more__text {
		font-size: 28rpx;
		color: #999
	}
	
	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}
	
	.uni-load-more__img>view {
		position: absolute
	}
	
	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}
	
	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}
	
	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}
	
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}
	
	.load2 {
		transform: rotate(30deg)
	}
	
	.load3 {
		transform: rotate(60deg)
	}
	
	.load1 view:nth-child(1) {
		animation-delay: 0s
	}
	
	.load2 view:nth-child(1) {
		animation-delay: .13s
	}
	
	.load3 view:nth-child(1) {
		animation-delay: .26s
	}
	
	.load1 view:nth-child(2) {
		animation-delay: .39s
	}
	
	.load2 view:nth-child(2) {
		animation-delay: .52s
	}
	
	.load3 view:nth-child(2) {
		animation-delay: .65s
	}
	
	.load1 view:nth-child(3) {
		animation-delay: .78s
	}
	
	.load2 view:nth-child(3) {
		animation-delay: .91s
	}
	
	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}
	
	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}
	
	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}
	
	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}
	
	@-webkit-keyframes load {
		0% {
			opacity: 1
		}
	
		100% {
			opacity: .2
		}
	}
</style>
