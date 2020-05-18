<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in product.image" :key="index">
					<view class="image-wrapper">
						<image
							:src="item" 
							class="loaded" 
							mode="aspectFill"
						></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="introduce-section">
      <view class="price-box">
      	<text class="price-tip">¥</text>
      	<text class="price">{{currentSku && currentSku.price || 0}}</text>
      	<text class="m-price" v-if="currentSku && currentSku.market_price>0">{{currentSku && currentSku.market_price || 0}}</text>
      </view>
      <view class="ser_tag" v-if="product.service_tags && product.service_tags.length>0">
        <view class="ser-item">
        	<text v-for="(item, index) in product.service_tags" :key="index">{{item}}</text>
        </view>
      </view>
			<text class="title">{{product.title || ''}}</text>
      <text class="description">{{product.description || ''}}</text>
			<view class="bot-row">
				<text>销量: {{product.sold_count || 0}}</text>
				<text>分享: {{product.share_num || 0}}</text>
				<text>收藏: {{product.favorite || 0}}</text>
				<!-- <text>库存: {{currentSku && currentSku.stock || 0}}</text> -->
			</view>
		</view>
		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">购买类型</text>
				<view class="con">
			<!-- 		<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
						{{sItem.name}}
					</text> -->
          <text class="selected-text">
          	{{(currentSku && currentSku.value) || ''}}
          </text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
<!-- 			<view class="c-row b-b">
				<text class="tit">优惠券</text>
				<text class="con t-r red">领取优惠券</text>
				<text class="yticon icon-you"></text>
			</view> -->
			<view class="c-row b-b" v-if="product.promotion && product.promotion.length">
				<text class="tit">促销活动</text>
				<view class="con-list">
          <text v-for="(item, i) in product.promotion" :key="i">{{item}}</text>
				</view>
			</view>
 <!--     <view class="c-row b-b" v-if="product.service_tags && product.service_tags.length">
      	<text class="tit">服务</text>
      	<view class="bz-list con">
      		<text v-for="(item, index) in product.service_tags" :key="index">{{item}} ·</text>
      	</view>
      </view> -->
		</view>
		
		<!-- 评价 -->
		<view class="eva-section" v-if="reviewList.total>0">
			<view class="e-header">
				<text class="tit">用户评价</text>
				<text>({{product.review_count || 0}})</text>
				<text class="tip">好评率 {{reviewList.good_review}}</text>
				<text class="yticon icon-you"></text>
			</view> 
			<view class="eva-box">
				<image class="portrait" :src="reviewFirst.user.avatar" mode="aspectFill"></image>
				<view class="right">
					<text class="name">{{reviewFirst.user.nickname}}</text>
					<text class="con">{{reviewFirst.content}}</text>
					<view class="bot">
						<text class="attr">购买类型：{{reviewFirst.sku.attributes}}</text>
						<text class="time">{{reviewFirst.create_time_text}}</text>
					</view>
				</view>
			</view>
      <view class="more-eva">
        <text>查看全部评价</text>
        <view class="more-eva-r">
          <text>共{{product.review_count || 0}}条</text>
          <text class="yticon icon-you"></text>
        </view>
      </view>
		</view>
		<view class="store-info" v-if="product.store && product.store.log_image_text">
		  <image class="logo" :src="product.store.log_image_text" mode=""></image>
      <view class="store-r">
        <view class="name">
          {{product.store.name}}
        </view>
        <view class="store-btn">
          <button class="cu-btn" @click="_collectStore(product.store.id)">{{collectText}}</button>
          <button class="cu-btn" @click="_toStore(product.store.id)">进店逛逛</button>
        </view>
        
      </view>
		</view>
		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<!-- <rich-text :nodes="desc"></rich-text> -->
			<rich-text :nodes="product.content"></rich-text>
		</view>
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>
			<view class="p-b-btn" :class="{active: favorite}" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>
			
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="_addCart">加入购物车</button>
        <button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">立即购买</button>
			</view>
		</view>
    <!-- 规格-模态层弹窗 -->
    <view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
    	<!-- 遮罩层 -->
    	<view class="mask"></view>
    	<view class="layer attr-content" @click.stop="stopPrevent">
    		<view class="a-t">
    			<image :src="(currentSku && currentSku.image) || (product.image && product.image[0])"></image>
    			<view class="right" v-if="currentSku  &&  currentSku.stock > 0">
    				<text class="price">{{currentSku && currentSku.price}}</text>
    				<!-- <text class="stock">库存：{{currentSku && currentSku.stock}} {{product.unit && product.unit.code}}</text> -->
    				<text class="stock">库存：{{currentSku && currentSku.stock}}</text>
    				<view class="selected">
    					已选：
    					<text class="selected-text">
    						{{currentSku && currentSku.value}}
    					</text>
    				</view>
    			</view>
    		</view>
    		<view v-for="(item,index) in product.attrItems" :key="index" class="attr-list">
    			<text>{{product.attrGroup[index]}}</text>
    			<view class="item-list">
    				<text v-for="(childItem, childIndex) in item" v-if="childItem.pid === item.id" :key="childIndex" class="tit"
    				 :class="{selected: attrChoose[index] === childIndex, disabled: skusStates[index][childIndex] == false}" @click="selectSpec(index, childIndex, item)">
    					{{childItem}}
    				</text>
    			</view>
    		</view>
    		<view class="attr-quantity">
    			<text>数量</text>
    			<number-box class="number-box" :disabled="true" :step="1" v-model="quantity" :min="1"></number-box>
    		</view>
        <view class="btn-group" v-if="currentSku && currentSku.stock > 0">
          <button type="default" class="cu-btn btn-cart" @click="_addCart">加入购物车</button>
          <button type="default" class="cu-btn btn-buy" @click="buy">立即购买</button>
        </view>
    		<!-- <button class="btn" @click="toggleSpec" v-if="currentSku && currentSku.stock > 0">完成</button> -->
    		<button class="btn disabled" v-else>库存不足</button>
    	</view>
    </view>
    <!--  -->
    <!-- 悬浮上拉 -->
    <view class="scroll_top" @click="topScrollTap" v-bind:class="[scrollTop ? 'active' : '','']"
          style="bottom: 56px;">
        <text class="cuIcon-top"></text>
    </view>
    <tui-toast ref="toast"></tui-toast>
	</view>
</template>

<script>
  import tuiToast from "@/components/ThorUI/toast/toast"
	import share from '@/components/share';
  import {mapState,mapMutations} from 'vuex'
  import numberBox from '@/components/wlp-number'
	export default{
		components: {
			share,
      numberBox,
      tuiToast
		},
		data() {
			return {
				specClass: 'none',
				specSelected:[],		
				favorite: 0,
				shareList: [],
        productId:'',
        product: {},
        quantity:1,
        attrChoose:{},
        couponList:[],
        good_review: '100%',
        reviewList:[],
        reviewFirst:{},
        skusStates: [],
        skusValueAsKey: [],
        scrollTop: false,
        collectText:'' //是否收藏店铺
			};
		},
    computed:{
      ...mapState(['token','userInfo']),
      currentSku() {
      	let attrValues = []
      	for (let i in this.attrChoose) {
      		attrValues.push(this.product.attrItems[i][this.attrChoose[i]])
      	}
      	const val = attrValues.join(',')
      	for (let i in this.product.skus) {
      		if (this.product.skus[i].value == val) return this.product.skus[i]
      	}
      }
    },
		async onLoad(options){
			let id = options.id;
      this.productId = id  
      if(!this.userInfo.nickname){
         this.setUserInfo(uni.getStorageSync('state_userInfo'))
      }
      this.getProduct()
      this.getReviews()
      this.getProductCoupon()
      // #ifdef H5
      if (this.$jwx && this.$jwx.isWechat()) {
        this.$jwx.initJssdk(function(res){
          console.log('this.$jwx',res)
        })
      }
      // #endif
		},
    onShareAppMessage() {
      var _this = this
      console.log('分享')
      this.shareInc()
      return {
        title: _this.product.title,
        path: `/pages/product/product?id=${this.productId}`,
        success:function(){
          console.log('成功')
        }
      }
    },
		methods:{
      ...mapMutations(['setStoreId','setUserInfo','setToken']),
      navToLogin(){
        if(!this.userInfo.mobile){
          uni.navigateTo({
            url:'/pages/login/login'
          })
          return false
        }else{
          return true
        }
      },
      _collectStore(id){
        console.log(this.navToLogin())
        if(!this.navToLogin()){
          this.navToLogin()
        }else{
          this.collectSwitch(id)
        }
      },
      _toStore(id){
        this.setStoreId(id)
        uni.navigateTo({
          url:`/pages/router-page/home`
        })
      },
      shareInc(){
        this.$http.post(`/addons/xshop/product/shareInc`,{
          token:this.token || uni.getStorageSync('state_token'),
          id:this.productId,
        }).then(response => {
          const data = response.data;
          console.log('shareInc',data)
          this.$api.msg(response.msg)
          if (response.code === 1) {
          }
        });
      },
      collectSwitch(id){
        let status = this.product.store.attention_status == 0 ? 1 : 0
        this.$http
          .post(`/api/store/collect/switch`,{
            store_id:id,
            token:this.token  || uni.getStorageSync('state_token'),
            status:status
          })
          .then(response => {
            console.log(response)
            const data = response.data;
            if (response.code === 1) {
              this.collectText = this.collectText =='已收藏' ? '收藏店铺' : '已收藏'
              console.log(this.product.store.attention_status)
              this.product.store.attention_status = status
              console.log(this.product.store.attention_status)
              this.$api.msg(response.msg)
             console.log('data',data)
            }else{
              this.$api.msg(response.msg)
            }
          });
      },
      //规格弹窗开关
      getGroupPrice() {
      	if (this.product.groupon) {
      		let groupPrice = this.product.groupon.group_price
      		this.current_group_price = groupPrice[this.currentSku.id]
      	} else{
          this.current_group_price = 0
        } 
      },
      toggleSpec() {
      	if (this.specClass === 'show') {
      		this.specClass = 'hide'
      		setTimeout(() => {
      			this.specClass = 'none'
      		}, 250)
      	} else if (this.specClass === 'none') {
      		this.specClass = 'show'
      	}
      },
      specInit() {
      	for (let index in this.product.attrGroup) {
      		this.$set(this.attrChoose, index, 0)
      	}
      	this.getSkusStates()
      },
      //选择规格
      selectSpec(index, childIndex, item) {
      	this.$set(this.attrChoose, index, childIndex)
      	this.getSkusStates()
      },
      getSkusStates() {
      	let result = []
      	let data = this.attrChoose
      	this.product.attrItems.forEach((item, index) => {
      		let row = []
      		item.forEach((subItem, subIndex) => {
      			if (subIndex != data[index]) {
      				let value = this.getSkuItem(index, subIndex, subItem)
      				if (this.skusValueAsKey[value].stock <= 0) row[subIndex] = false
      				else row[subIndex] = true
      			} else {
      				row[subIndex] = true
      			}
      		})
      		result.push(row)
      	})
      	this.skusStates = result
      },
      getSkuItem(index, subIndex, subItem) {
      	let result = []
      	let data = this.attrChoose
      	for (let key in data) {
      		if (index == key) {
      			result.push(subItem)
      		} else {
      			result.push(this.product.attrItems[key][data[key]])
      		}
      	}
      	return result.join(',')
      },
      convertSkusKey(skus) {
      	skus.forEach((item, index) => {
      		this.skusValueAsKey[item.value] = item
      	})
      },
      getProductCoupon(){
        this.$http.post(`/addons/xshopcoupon/coupon/getProductCoupon`,{
          token:this.token  || uni.getStorageSync('state_token'),
          id:this.productId,
        }).then(response => {
          const data = response.data;
          console.log('getProductCoupon',data)
          if (response.code === 1) {
        
          }
        });
      },
      xshopAdd(){
        let form = {
        	sku_id: this.currentSku.id,
        	quantity: this.quantity
        }
        this.$http.post(`/addons/xshop/cart/add`,{
          token:this.token  || uni.getStorageSync('state_token'),
          quantity:form.quantity,
          sku_id:form.sku_id
        }).then(response => {
          const data = response.data;
          this.$api.msg(response.msg)
          if (response.code === 1) {
            let params = {
            	title: "添加成功,在购物车等亲~",
            	imgUrl: "https://cdn.swh296.com/img/iconList/check-circle.png",
            	icon: true
            }
            this.$refs.toast.show(params)
          }
        });
      },
      onPageScroll: function (e) {
        // console.log('e',e)
        this.scrollTop = e.scrollTop > 200;
      },
      topScrollTap: function () {
          uni.pageScrollTo({
              scrollTop: 0,
              duration: 300
          });
      },
      doFavorite(){
        this.$http
          .post(`/addons/xshop/product/favorite`,{
            id:this.productId,
            token:this.token  || uni.getStorageSync('state_token'),
            state:this.favorite
          })
          .then(response => {
            const data = response.data;
            if (response.code === 1) {
              this.$api.msg(response.msg)
            }
          });
      },
      getReviews(){
        this.$http
          .post(`/addons/xshop/product/getReviews`,{
            id:this.productId,
            token:this.token  || uni.getStorageSync('state_token'),
            page:1
          })
          .then(response => {
            const data = response.data;
            if (response.code === 1) {
             this.reviewList = data
             if(data.total>0){
               this.reviewFirst = data.data[0]
             }
            }
          })
      },
      getProduct(){
        this.$http
          .post(`/addons/xshop/product/index`,{
            id:this.productId,
            token:this.token || uni.getStorageSync('state_token') 
          })
          .then(response => {
            const data = response.data;
            if (response.code === 1) {
             this.product = this.parseProduct(data)
             uni.setNavigationBarTitle({
             	title:this.product.title
             })
             this.collectText =this.product.store &&  this.product.store.attention_status == 0 ? '收藏店铺' : '已收藏'
             this.favorite = this.product.favorite
             this.convertSkusKey(this.product.skus)
             this.specInit()
            }
          })
      },
      parseProduct(product) {
      	product.content = this.$parseHtml(product.content)
      	return product
      },
			//收藏
			toFavorite(){
        if(!this.navToLogin()){
          this.navToLogin()
        }else{
          this.favorite = this.favorite == 0 ? 1 : 0;
          this.doFavorite()
        }
			},
      _addCart() {
        console.log('this.userInfo',this.userInfo)
        if(!this.userInfo.mobile){
        	let url = '/pages/login/login';
        	uni.navigateTo({
        		url
        	}) 
        }else {
          if(this.currentSku  &&  this.currentSku.stock > 0){
            this.xshopAdd()
          }else{
            this.$api.msg('库存余额不足')
          }
        }
        this.specClass = 'none'
      },
			buy(){
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
        }else {
          if(this.currentSku  && this.currentSku.stock > 0){
            let form = {
              sku_id: this.currentSku.id,
              quantity: this.quantity
            }
            form = JSON.stringify(form)
            uni.navigateTo({
            	// url: `/pages/order/createOrder?id=${this.product.id}&`
            	url: `/pages/order/createOrder?form=${form}`
            })
            // this.cart()
          }else{
            this.$api.msg('库存余额不足')
          }
        }
        this.specClass = 'none'
			},
      
			stopPrevent(){}
		},
		watch: {
			currentSku: {
				handler(val) {
					this.getGroupPrice()
				},
				deep: true
			}
		}
	}
</script>

<style lang='scss'>
  @import 'mixin.scss';
 /* p{
    margin: -2px auto;
  } */
	page{
		background: $page-color-base;
		padding-bottom: 160rpx;
	}
  image{
    margin:0 auto;
  }
  .container{
    padding-bottom: 160rpx;
  }
	.icon-you{
		font-size: $font-base + 2rpx;
		color: #888;
    margin-top: 5rpx;
	}
	.carousel {
		height: 722rpx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750rpx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
	}
	
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20rpx 30rpx;
		
		.title{
			font-size: 32rpx;
			color: $font-color-dark;
			height: 50rpx;
			line-height: 50rpx;
		}
    .description{
      display: block;
      margin-top: 6rpx;
      font-size: 24rpx;
      color: #666666;
    }
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64rpx;
			padding: 10rpx 0;
			font-size: 30rpx;
			color:$uni-color-primary;
		}
		.price{
			font-size: 44rpx;
		}
		.m-price{
			margin:0 12rpx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4rpx 10rpx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6rpx;
			line-height: 1;
			transform: translateY(-4rpx); 
		}
		.bot-row{
      margin-top: 20rpx;
			display:flex;
      line-height: 60rpx;
			align-items:center;
      justify-content: space-between;
			height: 60rpx;
			font-size: $font-sm;
			color: $font-color-light;
			text{
				flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
			}
		}
	}
  .ser_tag{
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin: 10rpx auto;
    .ser-item{
      margin-right: 12rpx;
      padding: 0 12rpx;
      color: #E6535A;
      font-size: 24rpx;
      height:34rpx;
      line-height: 34rpx;
      background:rgba(9,111,208,0);
      border:1px solid rgba(230, 83, 90, 1);
      border-radius:14rpx;
    }
  }
	/* 分享 */
	.share-section{
		display:flex;
		align-items:center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12rpx 30rpx;
		.share-icon{
			display:flex;
			align-items:center;
			width: 70rpx;
			height: 30rpx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4rpx;
			position:relative;
			overflow: hidden;
			font-size: 22rpx;
			color: $uni-color-primary;
			&:after{
				content: '';
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
				left: -20rpx;
				top: -12rpx;
				position:absolute;
				background: $uni-color-primary;
			}
		}
		.icon-xingxing{
			position:relative;
			z-index: 1;
			font-size: 24rpx;
			margin-left: 2rpx;
			margin-right: 10rpx;
			color: #fff;
			line-height: 1;
		}
		.tit{
			font-size: $font-base;
			margin-left:10rpx;
		}
		.icon-bangzhu1{
			padding: 10rpx;
			font-size: 30rpx;
			line-height: 1;
		}
		.share-btn{
			flex: 1;
			text-align:right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}
		.icon-you{
			font-size: $font-sm;
			margin-left: 4rpx;
			color: $uni-color-primary;
		}
	}
	
	.c-list{
		font-size: $font-sm + 2rpx;
		color: $font-color-base;
		background: #fff;
    margin: 16rpx auto;
		.c-row{
			display:flex;
			align-items:center;
			padding: 20rpx 30rpx;
			position:relative;
		}
		.tit{
			width: 140rpx;
		}
		.con{
			flex: 1;
			color: $font-color-dark;
			.selected-text{
				margin-right: 10rpx;
			}
		}
		.bz-list{
			height: 40rpx;
			font-size: $font-sm+2rpx;
			color: $font-color-dark;
			text{
				display: inline-block;
				margin-right: 30rpx;
			}
		}
		.con-list{
			flex: 1;
			display:flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40rpx;
		}
		.red{
			color: $uni-color-primary;
		}
	}
	
	/* 评价 */
	.eva-section{
		display: flex;
		flex-direction: column;
		padding: 20rpx 30rpx 0;
		background: #fff;
		margin-top: 16rpx;
		.e-header{
			display: flex;
			align-items: center;
			height: 70rpx;
			font-size: $font-sm + 2rpx;
			color: $font-color-light;
			.tit{
				font-size: $font-base + 2rpx;
				color: $font-color-dark;
				margin-right: 4rpx;
			}
			.tip{
				flex: 1;
				text-align: right;
			}
			.icon-you{
				margin-left: 10rpx;
			}
		}
    .more-eva{
      width: 100%;
      height: 70rpx;
      line-height: 70rpx;
      @include flexSB;
      color: #333537;
      font-size: 30rpx;
      .more-eva-r{
        @include flexX;
        @include flexA;
        font-size: $font-sm + 2rpx;
        color: #999999;
      }
    }
	}
	.eva-box{
		display: flex;
		padding: 20rpx 0;
    border-bottom: 1px solid #E4E7ED;
		.portrait{
			flex-shrink: 0;
			width: 80rpx;
			height: 80rpx;
			border-radius: 100px;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26rpx;
			.con{
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20rpx 0;
			}
      .name{
            color: #606266;
      }
			.bot{
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color:$font-color-light;
			}
		}
	}
  .store-info{
    height: 140rpx;
    font-size: 28rpx;
    color: #333537;
    display: flex;
    align-items: center;
    background-color: #fff;
    .logo{
      width: 120rpx;
      height: 120rpx;
      margin-left: 50rpx;
      margin-right: 0;
    }
    .store-r{
      margin-left: 30rpx;
      display: flex;
      flex-direction: column;
      .name{
        margin-bottom: 14rpx;
      }
      .store-btn{
        display: flex;
        align-items: center;
        .cu-btn{
          width:140rpx;
          padding: 0;
          height:52rpx;
          margin-right: 20rpx;
          border-radius: 26rpx;
          font-size:24rpx;
          background:rgba(240,240,240,1);
          border-radius:26rpx;
          color:rgba(234,84,62,1);
        }
      }
    }
  }
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16rpx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80rpx;
			font-size: $font-base + 2rpx;
			color: $font-color-dark;
			position: relative;
				
			text{
				padding: 0 20rpx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300rpx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc; 
			}
		}
	}
	
	/* 规格选择弹窗 */
	.attr-content{
		padding: 10rpx 30rpx;
		.a-t{
			display: flex;
			image{
				width: 170rpx;
				height: 170rpx;
				flex-shrink: 0;
				margin-top: -40rpx;
        margin-left: 0;
        margin-right: 8rpx;
				border-radius: 8rpx;;
			}
			.right{
				display: flex;
				flex-direction: column;
				padding-left: 24rpx;
				font-size: $font-sm + 2rpx;
				color: $font-color-base;
				line-height: 42rpx;
				.price{
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10rpx;
				}
				.selected-text{
					margin-right: 10rpx;
				}
			}
		}
    .attr-quantity {
    	display: flex;
    	flex: 1;
    	flex-direction: row;
    	font-size: $font-base;
    	color: $font-color-base;
    	padding-top: 20upx;
    	padding-left: 10upx;
    	align-items: center;
    
    	.number-box {
    		margin-left: 40upx;
    	}
    }
    .btn-group{
      width: 380rpx;
      @include flexSB;
      margin-top: 25rpx;
      button{
        /* width:220rpx; */
        height:60rpx;
        line-height: 60rpx;
        border-radius:30rpx;
        font-size: 26rpx;
        color: #fff;
        &.btn-buy{
        background:rgba(246,68,67,1);
        }
        &.btn-cart{
          background:rgba(255,153,0,1);
        }
      }
    }
		.attr-list{
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2rpx;
			color: $font-color-base;
			padding-top: 30rpx;
			padding-left: 10rpx;
		}
		.item-list{
			padding: 20rpx 0 0;
			display: flex;
			flex-wrap: wrap;
			text{
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				border-radius: 100rpx;
				min-width: 60rpx;
				height: 60rpx;
				padding: 0 20rpx;
				font-size: $font-base;
				color: $font-color-dark;
			}
			.selected{
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}
	
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		
		&.show {
			display: block;
			.mask{
				animation: showPopup 0.2s linear both;
			}
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			.mask{
				animation: hidePopup 0.2s linear both;
			}
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
		.mask{
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 33vh;
			border-radius: 10rpx 10rpx 0 0;
			background-color: #fff;
			.btn{
				height: 66rpx;
				line-height: 66rpx;
				border-radius: 100rpx;
				background: $uni-color-primary;
				font-size: $font-base + 2rpx;
				color: #fff;
				margin: 30rpx auto 20rpx;
			}
      .item-list {
      	.disabled {
      		background: #EFEEEE;
      		color: #B1B1B1;
      	}
      }
      .disabled {
      	background: $font-color-disabled;
      }
		}
		@keyframes showPopup {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}
			100% {
				transform: translateY(0%);
			}
		}
		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(120%);
			}
		}
	}
	
	/* 底部操作菜单 */
	.page-bottom{
		position:fixed;
		left: 30rpx;
		bottom:30rpx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690rpx;
		height: 100rpx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20rpx 0 rgba(0,0,0,.5);
		border-radius: 16rpx;
		
		.p-b-btn{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96rpx;
			height: 80rpx;
			.yticon{
				font-size: 40rpx;
				line-height: 48rpx;
				color: $font-color-light;
			}
			&.active, &.active .yticon{
				color: $uni-color-primary;
			}
			.icon-fenxiang2{
				font-size: 42rpx;
				transform: translateY(-2rpx);
			}
			.icon-shoucang{
				font-size: 46rpx;
			}
		}
		.action-btn-group{
			display: flex;
			height: 76rpx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20rpx 40rpx -16rpx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30,#fa436a,#F56C6C);
			margin-left: 20rpx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28rpx;
				width: 0;
				border-right: 1px solid rgba(255,255,255,.5);
			}
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 180rpx;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
	
</style>
