<template>
	<view class="container" :style="{height:height}">
    <view class="input-section">
      <input type="text" v-model="linkValue" value="" />
    </view>
    <button class="cu-btn" :disabled="disabled" @click="_copy">复制链接</button>
	</view>
</template>

<script>
  import {mapState} from 'vuex';
	export default {
		data() {
			return {
				disabled:false,
        linkValue:'',
        height:''
			};
		},
    computed:{
      ...mapState(['token'])
    },
    onLoad() {
      this.height = uni.getSystemInfoSync().windowHeight
      this.link()
    },
    methods: {
      _copy(){
        // #ifdef MP-WEIXIN
         uni.setClipboardData({
             data: this.linkValue,
             success: function () {
                 uni.getClipboardData({
                     success: function (res) {
                         console.log(res.data);
                     }
                 });
             }
         });
         // #endif
      },
      _toPromoteDetail(){
        uni.navigateTo({
          url:'/pages/promote/to_promote'
        })
      },
      link(){
        this.$http
          .post(`/api/agent/recommend/link`,{
            token:this.token || uni.getStorageSync('state_token') 
          })
          .then(response => {
            const data = response.data;
            console.log(response)
            if (response.code == 1) {
              this.linkValue = data.url
              console.log('data',data)
            }
          });
      }
    }
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
  background-image: url('http://cdn.swh296.com/img/promote/promote_bg1.png');
  background-size: 100% 100%;
  overflow: hidden;
  @include flexY;
  @include flexA;
  .input-section{
    width:600rpx;
    margin-top: 380rpx;
    height:88rpx;
    background:rgba(250,253,255,1);
    border:4rpx solid rgba(77, 157, 240, 1);
    border-radius:14rpx;
    box-sizing: border-box;
    input{
      width: 100%;
      height: 100%;
      font-size: 26rpx;
    }
  }
  .cu-btn{
    margin-top: 65rpx;
    width:600rpx;
    height:90rpx;
    background:linear-gradient(-90deg,rgba(247,134,23,1) 0%,rgba(255,147,103,1) 100%);
    border-radius:45rpx;
    font-size:34rpx;
    color: #fff;
  }
}
</style>
