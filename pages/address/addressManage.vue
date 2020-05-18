<template>
	<view class="content">
      <uni-nav-bar left-icon="back" v-if="manageType =='edit'"  @clickLeft="back" right-text="删除" @clickRight="_deleteAddress" title="编辑收获地址"></uni-nav-bar>
		<view class="row b-b">
			<text class="tit">收货人</text>
			<input class="input" type="text" v-model="addressData.contactor_name" maxlength="6" placeholder="收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.phone" placeholder="收货人手机号码" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">所在地区</text>
        <!-- #ifdef MP-WEIXIN -->
        <picker class="address_picker" @change="_bindAddressChange" name="region"  mode ="region" :value="array" >
            {{addressData.address}}
        </picker>
        <!-- #endif -->
			<!-- <text class="yticon icon-shouhuodizhi"></text> -->
		</view>
		<view class="row b-b"> 
			<text class="tit">详细地址</text>
			<input class="input" type="text" v-model="addressData.street" placeholder="楼号、门牌" placeholder-class="placeholder" />
		</view>
		
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<!-- <switch :checked="addressData.is_default" color="#fa436a" @change="switchChange" /> -->
			<switch checked="true" color="#fa436a" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
    <!-- <button class="btns" type="primary" @tap="openAddres">默认打开地址</button> -->
    <simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor="#007AFF"></simple-address>
	</view>
</template>

<script>
  import {mapState} from 'vuex'
  import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
  import simpleAddress from '@/components/simple-address/simple-address.vue'
  export default {
    components: {uniNavBar,simpleAddress},
		data() {
			return {
				addressData: {
					contactor_name: '',
					phone: '',
					addressName: '在地图选择',
					address: '江苏省无锡市梁溪区',
					street: '',
					is_default: 0,
          id:''
				},
        array: [],
        manageType:'',
        cityPickerValueDefault: [0, 0, 1],
        pickerText: '',
        defchecked:1
        // checked:1
			}
		},
    computed:{
      ...mapState(['token']),
      // defchecked(){
      //   return 1
      // }
    },
		onLoad(option){
			let title = '新增收货地址';
			if(option.type==='edit'){
				title = '编辑收货地址'
				this.addressData = JSON.parse(option.data)
        // this.checked = this.addressData.is_default
        // console.log(typeof this.checked)
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
      openAddres() {
      	this.cityPickerValueDefault = [0,0,1]
      	this.$refs.simpleAddress.open();
      },
      openAddres2() {
      	// 根据 label 获取
      	var index = this.$refs.simpleAddress.queryIndex(['湖北省', '随州市', '曾都区'], 'label');
      	console.log(index);
      	this.cityPickerValueDefault = index.index;
      	this.$refs.simpleAddress.open();
      },
      openAddres3() {
      	// 根据value 获取
      	var index = this.$refs.simpleAddress.queryIndex([13, 1302, 130203], 'value');
      	console.log(index);
      	this.cityPickerValueDefault = index.index;
      	this.$refs.simpleAddress.open();
      },
      onConfirm(e) {
      	this.pickerText = JSON.stringify(e);
      },
      _bindAddressChange(e){
        console.log('picker发送选择改变，携带值为', e.target.value)
        this.addressData.address =e.target.value.join('')
      },
      back(){
        uni.navigateBack()
      },
      _deleteAddress(){
        uni.showLoading()
        this.delAddress()
      },
			switchChange(e){
        console.log(e.detail)
				this.addressData.is_default = e.detail.value ? 1 : 0;
        console.log(this.addressData.is_default)
			},
			
			//地图选择地址
			chooseLocation(){
				uni.chooseLocation({
					success: (data)=> {
						this.addressData.addressName = data.name;
						this.addressData.address = data.name;
					}
				})
			},
			
			//提交
			confirm(){
				let data = this.addressData;
				if(!data.contactor_name){
					this.$api.msg('请填写收货人姓名');
					return;
				}
        // if(data.contactor_name.length<2 || data.contactor_name.length>6){
        // 	this.$api.msg('收货人姓名长度有误');
        // 	return;
        // }
				if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.phone)){
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				if(!data.address){
					this.$api.msg('请选择您的所在地区');
					return;
				}
				if(!data.street){
					this.$api.msg('请填写门牌号信息');
					return;
				}
				// this.$api.prePage().refreshList(data, this.manageType);
				// this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
        uni.showLoading({
          title:'正在提交...'
        })
        this.editAddress()
			},
      delAddress(){
        this.$http
          .post(`/addons/xshop/user/delAddress`,{
            token:this.token,
            address_id:this.addressData.id
          })
          .then(response => {
            const data = response.data;
            uni.hideLoading()
            if (response.code === 1) {
             console.log('data',data)
             setTimeout(()=>{
             	uni.navigateBack()
             }, 800)
            }
          });
      },
      editAddress(){
        this.$http
          .post(`/addons/xshop/user/editAddress`,{
            token:this.token,
            contactor_name:this.addressData.contactor_name,
            address:this.addressData.address,
            phone:this.addressData.phone,
            // is_default:this.addressData.default ? 1: 0,
            is_default:this.addressData.is_default,
            street: this.addressData.street,
            address_id:this.addressData.id
          })
          .then(response => {
            const data = response.data;
            uni.hideLoading()
            if (response.code === 1) {
             console.log('data',data)
             this.$api.msg(response.msg);
             setTimeout(()=>{
             	uni.navigateBack()
             }, 800)
            }else{
              this.$api.msg(response.msg);
            }
          });
      }
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16rpx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30rpx;
		height: 110rpx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 150rpx;
			font-size: 30rpx;
			color: $font-color-dark;
		}
		.input,.address_picker{
			flex: 1;
      height: 100%;
      line-height: 110rpx;
			font-size: 30rpx;
			color: $font-color-dark;
		}
    .address_picker{
      .uni-input{
        height: 110rpx;
        line-height: 110rpx;
      }
    }

		.icon-shouhuodizhi{
			font-size: 36rpx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16rpx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16rpx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690rpx;
		height: 80rpx;
		margin: 60rpx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10rpx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
