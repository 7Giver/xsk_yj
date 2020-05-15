<template>
  <view class="container">
    <view  v-if="userInfo.shelves_switch == 0">
      暂无页面
    </view>
    <view class="order-section" v-if="userInfo.shelves_switch == 1">
      <view class="item">
        <view class="item-l">
          <text class="tip">
            小站名称
            <text class="idot">*</text>
            ：
          </text>
        </view>
        <view class="item-r">
          <view class="input-section"><input type="text" v-model="newstore.name" maxlength="18" placeholder="请输入小站名称" value="" /></view>
        </view>
      </view>
<!--      <view class="item">
        <view class="item-l">
          <text class="tip">
            小站类型
            <text class="idot">*</text>
            ：
          </text>
        </view>
        <view class="item-r">
          <view class="input-section"><input type="text" v-model="newstore.storecat_id" maxlength="10" placeholder="请输入小站类型" value="" /></view>
        </view>
      </view> -->
      <!--  -->
      <view class="item">
        <view class="item-l">
          <text class="tip">
            真实姓名
            <text class="idot">*</text>
            ：
          </text>
        </view>
        <view class="item-r">
          <view class="input-section"><input type="text" v-model="newstore.realname" maxlength="11" placeholder="请输入您的姓名" value="" /></view>
        </view>
      </view>
      <view class="item">
        <view class="item-l">
          <text class="tip">
            手机号码
            <text class="idot">*</text>
            ：
          </text>
        </view>
        <view class="item-r">
          <view class="input-section"><input type="number" v-model="newstore.mobile" maxlength="11" placeholder="请输入手机号码" value="" /></view>
        </view>
      </view>
      <view class="item">
        <view class="item-l">
          <text class="tip">
            小站地址
            <text class="idot">*</text>
            ：
          </text>
        </view>
        <view class="item-r">
          <picker class="address_picker" @change="_bindAddressChange" name="region"  mode ="region" :value="addressList" >
              {{newstore.address}}
          </picker>
        </view>
      </view>
      <view class="item">
        <view class="item-l">
          <text class="tip">
            详细地址
            <text class="idot">*</text>
            ：
          </text>
        </view>
        <view class="item-r">
          <view class="input-section"><input type="text" v-model="newstore.street" maxlength="25" placeholder="街道、道路、门牌" value="" /></view>
        </view>
      </view>
      <view class="item">
        <view class="item-l">
          <text class="tip">
            身份证号
            <text class="idot">*</text>
            ：
          </text>
        </view>
        <view class="item-r">
          <view class="input-section"><input type="text" v-model="newstore.idcard" maxlength="18" placeholder="请输入您的身份证号" value="" /></view>
        </view>
      </view>
      <view class="item">
        <view class="item-l">
          <text class="tip">
            银行卡号
            <text class="idot">*</text>
            ：
          </text>
        </view>
        <view class="item-r">
          <view class="input-section"><input type="text" v-model="newstore.bankcard" maxlength="19" placeholder="请输入您的银行卡号" value="" /></view>
        </view>
      </view>
      <!--  -->
      <view class="swiper-section">
        <text class="tip">小站Logo</text>
        <view class="swiper-inner">
          <view class="grid col-4 grid-square flex-sub">
            <!-- @tap="ViewImage" -->
            <view class="bg-img" v-for="(item, index) in swiperList" :key="index" @tap="ChooseImage"  :data-url="swiperList[index]">
              <image :src="swiperList[index]" mode="aspectFill"></image>
              <!-- <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index"><text class="cuIcon-close"></text></view> -->
            </view>
            <view class="solids" @tap="ChooseImage" v-if="swiperList.length < 1"><text class="cuIcon-cameraadd"></text></view>
          </view>
        </view>
        <view class="max-tip">照片大小不可超过5MB</view>
      </view>
      <!--  -->
    </view>
    <view class="btn-section"><button class="cu-btn round" :disabled="disabled" @click="_confirm">提交审核</button></view>
  </view>
</template>

<script>
import { mapState,mapMutations } from 'vuex';
export default {
  components: {
  },
  data() {
    return {
      index: 0,
      newstore:{
        name:'',
        // storecat_id:'', //小站类型
        realname:'',
        mobile:'',
        idcard:'',
        bankcard:'',
        address:'北京市北京',
        street:''
      },
      addressList: [],
      swiperList: [],
      saveList: [],
      disabled:false
    };
  },
  computed: {
    ...mapState(['token','userInfo'])
  },
  async onLoad() {
    if(this.userInfo.store_id){
      const data = await this.shopinfo()
      console.log('data',data)
      this.newstore = data.store_info
      this.newstore.street = this.newstore.address
      this.newstore.address = this.newstore.province_text + this.newstore.city_text + this.newstore.area_text
      this.swiperList.push(this.newstore.log_image_text)
    }
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'setUserInfo',
      setToken: 'setToken'
    }),
    shopinfo(){
      return new Promise((resolve,reject)=>{
        this.$http
          .post(`/api/merchants/openshop/info`,{
            token:this.token,
            id:this.userInfo.store_id
          })
          .then(response => {
            const data = response.data;
            console.log(response)
            if (response.code == 1) {
              resolve(data)
            }else{
              this.$api.msg(response.msg)
            }
          })
      })
    },
    _bindAddressChange(e){
        console.log('picker发送选择改变，携带值为', e.target.value)
        this.newstore.address =e.target.value.join('')
    },
    _confirm() {
      if (this.newstore.name.trim() === '') {
        this.$api.msg('请输入小站名称');
        return;
      }
      if (this.newstore.realname.trim() === '') {
        this.$api.msg('请输入小站类型')
        return;
      }
      if (this.newstore.realname.trim() === '') {
        this.$api.msg('请输入您的真实姓名');
        return;
      }
      
      var myreg = /^(1)[3-9][0-9]{9}$/
      let mobile = this.newstore.mobile
      if(!mobile){
        this.$api.msg('请填写手机号')
        return;
      }
      if(mobile.length !=11 || !myreg.test(mobile)){
        this.$api.msg('请填写正确的手机号')
        return;
      }
      if (this.newstore.street.trim() === '') {
        this.$api.msg('请输入您的详细地址');
        return;
      }
      if (this.newstore.idcard.trim() === '') {
        this.$api.msg('请输入您的身份证号码');
        return;
      }
      if (this.newstore.idcard.trim().length !=18) {
        this.$api.msg('请输入正确的身份证号');
        return;
      }
      if (this.newstore.bankcard.trim() === '') {
         this.$api.msg('请输入您的银行卡号');
         return;
      }
      if (this.newstore.bankcard.trim().length<16 ) {
         this.$api.msg('请输入正确的银行卡号');
         return;
      }
      if (this.saveList.length == 0) {
        this.$api.msg('请上传小站Logo');
        return;
      }
      let newsaveList = this.saveList.join(',');
      this.apply(newsaveList)
    },
    apply(newsaveList) {
      var _this = this;
      this.disabled = true
      uni.showLoading({
        title:'正在提交...'
      })
      let objData = {
        token: this.token,
        name: this.newstore.name,
        realname: this.newstore.realname,
        mobile: this.newstore.mobile,
        idcard: this.newstore.idcard,
        bankcard: this.newstore.bankcard,
        address:this.newstore.address,
        street:this.newstore.street,
        log_image: newsaveList || this.newstore.log_image,
      }
      let params ={}
      if(this.userInfo.store_id){
        params = Object.assign(objData,{
          id:this.userInfo.store_id
        })
      }else{
       params = objData
      }
      console.log('params',params)
      this.$http
        .post(`/api/merchants/openshop/apply`, params)
        .then(response => {
          uni.hideLoading()
          console.log('response',response)
          const data = response.data;
          if (response.code === 1) {
            console.log('data', data);
            uni.hideLoading()
            this.disabled = false
            this.$api.msg('保存成功')
            this.setUserInfo(data.userinfo)
            this.setToken(data.userinfo.token)
            setTimeout(()=>{
              uni.switchTab({
                 url:'/pages/mine/index'
              })
            },500)
          }else{
            this.$api.msg(response.msg)
            this.disabled = false
          }
        });
    },
    ChooseImage() {
      var _this = this;
      uni.chooseImage({
        count: 3, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: res => {
          let size = res.tempFiles[0].size;
          if (size > 1500000) {
            this.$api.msg('大小超过限制');
            return;
          }
          uni.showLoading({
            title: '正在上传...'
          });
          uni.uploadFile({
            url: 'https://apis.53pzck.top/addons/qiniu/index/upload', 
            filePath: res.tempFilePaths[0],
            name: 'file',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            formData: {
              token: this.token
            },
            success: uploadFileRes => {
              let uploadData = uploadFileRes.data;
              let data = JSON.parse(`${uploadFileRes.data}`);
              let url = data.data.url;
              // this.saveList.push(url);
              this.saveList[0] = url
              console.log(this.saveList);
              uni.hideLoading();
            }
          });
          this.swiperList = res.tempFilePaths;
        }
      });
    },
    ViewImage(e) {
      uni.previewImage({
        urls: this.swiperList,
        current: e.currentTarget.dataset.url
      });
    },
    DelImg(e) {
      this.swiperList.splice(e.currentTarget.dataset.index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'mixin.scss';
.order-section {
  padding: 45rpx 45rpx 140rpx;
  color: #333537;
  font-size: 26rpx;
  .swiper-section {
    width: 100%;
    margin-bottom: 30rpx;
    .swiper-inner {
      .grid {
        margin-top: 20rpx;
      }
      .upload-image {
        width: 202rpx;
        height: 120rpx;
      }
    }
    .max-tip {
      color: #999999;
      font-size: 20rpx;
    }
  }
  .item {
    width: 100%;
    height: 76rpx;
    margin-bottom: 30rpx;
    line-height: 76rpx;
    @include flexSB;
    border: 1px solid rgba(206, 206, 206, 1);
    border-radius: 6rpx;
    .item-l {
      width: 220rpx;
      padding-left: 30rpx;
      &.date {
        width: 50%;
      }
    }
    .item-r {
      flex: 1;
      height: 100%;
      .address_picker{
        flex: 1;
        height: 100%;
      }
      .picker-section,
      .input-section {
        flex: 1;
        height: 100%;
        background: rgba(255, 255, 255, 0);
        border-radius: 6rpx;
        font-size: 26rpx;
        input {
          font-size: 26rpx;
          width: 100%;
          height: 100%;
        }
        picker {
          width: 100%;
          height: 100%;
          .choose-text {
            height: 100%;
            padding-right: 30rpx;
            @include flexSB;
            color: #cccccc;
          }
        }
      }
    }
  }
}
.btn-section {
  width: 100%;
  border-top: 1px solid #dddddd;
  height: 120rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 3;
  background-color: #fff;
  .cu-btn {
    width: 90%;
    left: 5%;
    background: linear-gradient(-90deg, rgba(242, 106, 83, 1) 0%, rgba(238, 67, 39, 1) 100%);
    height: 90rpx;
    margin-top: 15rpx;
    border-radius: 45rpx;
    color: #fff;
    font-size: 34rpx;
  }
}
.tip {
  text {
    color: #f0563d;
    &.idot {
      margin-left: 8rpx;
    }
  }
}
.tui-modal-custom {
  text-align: center;
}

.tui-prompt-title {
  text-align: left;
  padding-bottom: 20rpx;
  font-size: 34rpx;
}
.tui-input {
  margin: 30rpx 0rpx;
  border-bottom: 1rpx solid #e6e6e6;
  padding-bottom: 20rpx;
  text-align: left;
}
</style>
