<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
			<view class="wrapper">
				<view class="address-box">
					<text class="address">{{item.address}} {{item.street}}</text>
				</view>
				<view class="u-box">
					<text class="name">{{item.contactor_name}}</text>
					<text class="mobile">{{item.phone}}</text>
          <text v-if="item.is_default" class="tag">默认</text>
				</view>
			</view>
			<text class="yticon icon-bianji" @click.stop="addAddress('edit', item)"></text>
		</view>
    <!-- 空白页 -->
    <empty setSrc="https://cdn.swh296.com/img/common/empty_content.png" v-if="loaded === true && addressList.length === 0">
      <view class="empty-text">
        暂未添加地址
      </view>
    </empty>
		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
  import empty from '@/components/empty';
  import {mapState} from 'vuex';
	export default {
    components: {
      empty
    },
		data() {
			return {
				source: 0,
        addressList:[],
		    loaded:false
			}
		},
    computed:{
      ...mapState(['token'])
    },
    onShow() {
      this.getAddress()
    },
		onLoad(option){
      console.log(option)
			this.source = option.source;
      // this.getAddress()
		},
		methods: {
			//选择地址
			checkAddress(item){
				if(this.source == 1){
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().addressData = item;
					uni.navigateBack()
          return
				}
        if(this.source == 'appoint_pick'){
          console.log('item',item)
          this.$api.prePage().pickAddress = item.street + '\n' + item.contactor_name + item.phone
          uni.navigateBack()
           return
        }
        if(this.source == 'appoint_receive'){
          console.log('item',item)
          this.$api.prePage().receiveAddress = item.street + '\n' + item.contactor_name + item.phone
          uni.navigateBack()
           return
        }
			},
			addAddress(type, item){
				uni.navigateTo({
					url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			//添加或修改成功之后回调
			refreshList(data, type){
				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				this.addressList.unshift(data);
			},
      getAddress(){
        this.$http
          .post(`/addons/xshop/user/getAddress`,{
            token:this.token
          })
          .then(response => {
            const data = response.data;
            if (response.code === 1) {
              this.loaded = true
              this.addressList = data
            }
          });
      }
		}
	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 120rpx;
	}
	.content{
		position: relative;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;;
		background: #fff;
		position: relative;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			font-size: 24rpx;
			color: $base-color;
			margin-right: 10rpx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4rpx;
			padding: 4rpx 10rpx;
			line-height: 1;
		}
		.address{
			font-size: 30rpx;
			color: $font-color-dark;
		}
	}
	.u-box{
		font-size: 28rpx;
		color: $font-color-light;
		margin-top: 16rpx;
		.name{
			margin-right: 30rpx;
		}
    .tag{
        margin-left: 10rpx;
      	font-size: 24rpx;
      	color: $base-color;
      	margin-right: 10rpx;
      	background: #fffafb;
      	border: 1px solid #ffb4c7;
      	border-radius: 4rpx;
      	padding: 4rpx 10rpx;
      	line-height: 1;
    }
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80rpx;
		font-size: 40rpx;
		color: $font-color-light;
		padding-left: 30rpx;
	}
	
	.add-btn{
		position: fixed;
		left: 30rpx;
		right: 30rpx;
		bottom: 16rpx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690rpx;
		height: 80rpx;
		font-size: 32rpx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10rpx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
</style>
