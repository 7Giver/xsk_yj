<template>
	<view class="container">
			<view class="qrimg-i">
				<tki-qrcode v-if="ifShow" cid="qrcode1" ref="qrcode" @tap="previewQrcode" :val="val" :size="size" :unit="unit" :icon="icon" :iconSize="iconsize" :lv="lv" :onval="onval" :loadMake="loadMake" :usingComponents="true" @result="qrR" />
			</view>
		<view class="uni-padding-wrap uni-common-mt" v-if="false">
			<view class="uni-title">设置二维码大小</view>
		</view>
		<view class="body-view" v-if="false">
			<slider :value="size" @change="sliderchange" min="50" max="500" show-value />
		</view>
		<view class="uni-padding-wrap" v-if="false">
			<view class="btns">
				<button type="primary" @tap="selectIcon">选择二维码图标</button>
				<button type="primary" @tap="creatQrcode">生成二维码</button>
				<button type="primary" @tap="saveQrcode">保存到图库</button>
				<button type="warn" @tap="clearQrcode">清除二维码</button>
				<button type="warn" @tap="ifQrcode">显示隐藏二维码</button>
			</view>
		</view>
	</view>
</template>
<script>
import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
import {mapState} from 'vuex';
export default {
	data() {
		return {
      storeInfo:{},
			ifShow: true,
			val: '', // 要生成的二维码值
			size: 300, // 二维码大小
			unit: 'upx', // 单位
			background: '#b4e9e2', // 背景色
			foreground: '#309286', // 前景色
			pdground: '#32dbc6', // 角标色
			icon: '', // 二维码图标
			iconsize: 20, // 二维码图标大小
			lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
			onval: false, // val值变化时自动重新生成二维码
			loadMake: true, // 组件加载完成后自动生成二维码
			src: '' // 二维码生成后的图片地址或base64
		}
	},
  computed: {
    ...mapState(['token','userInfo'])
  },
  mounted() {
    this.getStoreInfo()
  },
  onLoad() {
    // this.getStoreInfo()
    this.val = this.$baseURL + `/api/store/store/qrcode/store_id/${this.userInfo.store_id}`
    console.log('this.val',this.val)
  },
	methods: {
    getStoreInfo(){
      var _this =this
      this.$http
        .post(`/api/store/store/info`,{
          id:this.userInfo.store_id || uni.getStorageSync('state_userInfo').store_id,
          token:this.token || uni.getStorageSync('state_token') 
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            this.storeInfo = response.data.store_info
            // this.$refs.qrcode._makeCode()
          }
        })
    },
		sliderchange(e) {
			this.size = e.detail.value
		},
		creatQrcode() {
			this.$refs.qrcode._makeCode()
		},
    previewQrcode(){
      let list = []
      list.push(this.src)
      console.log('previewQrcode',list)
      // 预览图片
      uni.previewImage({
          urls: list,
          longPressActions: {
              itemList: ['发送给朋友', '保存图片', '收藏'],
              success: function(data) {
                  console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片')
              },
              fail: function(err) {
                  console.log(err.errMsg)
              }
          }
      });
    },
		saveQrcode() {
			this.$refs.qrcode._saveCode()
		},
		qrR(res) {
			this.src = res 
      // this.src = this.$baseURL + '/api/store/store/qrcode/store_id/3'
      // console.log('res',res)
		},
		clearQrcode() {
			this.$refs.qrcode._clearCode()
			this.val = ''
		},
		ifQrcode() {
			this.ifShow = !this.ifShow
		},
		selectIcon() {
			let that = this
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: function (res) {
					that.icon = res.tempFilePaths[0]
          console.log('that.icon',that.icon)
					setTimeout(() => {
						that.creatQrcode()
					}, 100);
					// console.log(res.tempFilePaths);
				}
			});
		}
	},
	components: {
		tkiQrcode
	},
}
</script>
<style lang="scss" scoped>
  @import 'mixin.scss';
  page,.container{
    width: 100%;
    height: 100%;
    background-color: #fff;
    color: #333537;
    font-size: 30rpx;
  }
.container{
  width: 100%;
  background-image: url('http://cdn.swh296.com/img/promote/promote_bg.png');
  background-size: 100% 100%;
  overflow: hidden;
  @include flexY;
  @include flexA;
  .qrimg-i{
    margin-top: 700rpx;
  }
}
</style>
