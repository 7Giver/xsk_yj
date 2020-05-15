<template>
  <view class="container">
    <view class="order-section">
      <view class="item">
        <view class="item-l"><text class="tip">卡券范围：</text></view>
        <view class="item-r">
          <view class="picker-section">
            <picker @change="bindPickerChange" :value="index" :range="array">
              <!-- <view v-if="isPickerdefText" class="choose-text">
                <text>请选择卡券范围</text>
                <text class="cuIcon-unfold"></text>
              </view> -->
              <view class="uni-input">{{ array[index] }}</view>
            </picker>
          </view>
        </view>
      </view>
      <view class="cut-section">
        <text class="cut-l">
          满减金额
        </text>
        <view class="cut-r">
         <text>满</text>
          <view class="input-section">
            <input type="number"  v-model="totalPrice" value="" />
          </view>
          <text>减</text>
          <view class="input-section">
            <input type="number"  v-model="cutPrice" value="" />
          </view>
        </view>
      </view>
      <view class="item">
        <view class="item-l"><text class="tip">卡券数量：</text></view>
        <view class="item-r">
          <view class="input-section">
              <input type="number" v-model="couponQuantity" placeholder="请输入卡券数量" value="" />
          </view>
        </view>
      </view>
     <view class="item">
        <view class="item-l date"><text class="tip">卡券使用<text>开始</text>日期：</text></view>
       <view class="item-r">
         <timeSelector showType="dateToTime" @btnConfirm="btnConfirmStart" :beginDate="startPickerDate" @btnCancel="btnCancel" endDate="2025-12-31">
         	<view class="box-time">{{ startTime }}</view>
         </timeSelector>
        </view>
      </view>
      <view class="item">
        <view class="item-l date"><text class="tip">卡券使用<text>终止</text>日期：</text></view>
        <view class="item-r">
        <timeSelector showType="dateToTime" @btnConfirm="btnConfirmEnd" :beginDate="endPickerDate" @btnCancel="btnCancel" endDate="2025-12-31">
        	<view class="box-time">{{ endTime }}</view>
        </timeSelector>
        </view>
      </view>
      <!--  -->
      <view class="cut-section">
        <text class="cut-l">
          是否显示在首页:
        </text>
        <switch class="base" style="transform:scale(0.8)" @change="_switchShowIndex" :class="switch_showindex ? 'checked' : ''" :checked="switch_showindex ? true : false"></switch>
      </view>
    </view>
    <view class="btn-section"><button class="cu-btn round" :disabled="disabled" @click="_confirm">{{confirmText}}</button></view>
  </view>
</template>

<script>
import timeSelector from '@/components/wing-time-selector/wing-time-selector.vue';
import {mapState} from 'vuex';
import {addCoupon} from '../../common/js/commonInfo.js';
export default {
  components:{
    timeSelector
  },
  data() {
    return {
      array: ['全部', '品类', '单品'],
      index: 0,
      isPickerdefText:true,
      totalPrice:'',
      cutPrice:'',
      couponQuantity:'',
      startTime:'',
      endTime:'',
      startPickerDate:'',
      endPickerDate:'',
      startStamp:'',
      endStamp:'',
      confirmText:'确定',
      disabled:false,
      switch_showindex:true
    };
  },
  computed:{
    ...mapState(['token'])
  },
  onLoad() {
    this.startPickerDate = this.$service.dateTime().split(' ')[0]
    this.endPickerDate = this.$service.dateTime().split(' ')[0]
    console.log(this.$store.state)
    // new Date().setTime('timestamp' * 1000);
  },
  methods: {
    _switchShowIndex(e) {
      this.switch_showindex = e.detail.value;
    },
    async addCoupon(params) {
      this.disabled = true
      var _this = this;
      uni.showLoading({
        title:'正在提交...'
      })
      const resData = await addCoupon(params)
      console.log('resData',resData)
      if(resData.code === 1){
        uni.hideLoading()
        this.$api.msg(resData.msg)
        setTimeout(()=>{
          uni.navigateBack()
        },500)
      }
    },
    btnConfirmStart(e) {
    	console.log('确定时间为：', e);
    	this.startTime = e.key
      this.startStamp = e.stamp
      console.log('确定时间为：', this.endPickerDate);
    },
    btnConfirmEnd(e){
      this.endTime = e.key
      this.endStamp = e.stamp
      this.endPickerDate = e.key
    },
    btnCancel() {
    	console.log('取消时间：');
    },
    _confirm() {
      if(this.totalPrice<=0 || this.cutPrice<=0){
        this.$api.msg('请输入满减金额')
        return 
      }
      if(this.totalPrice - this.cutPrice <=0 ){
        this.$api.msg('请输入正确的满减金额')
        return 
      }
      if(this.couponQuantity <=0 ){
        this.$api.msg('请输入正确的卡券数量')
        return 
      }
      if(this.startTime == '' ){
        this.$api.msg('请输入卡券开始日期')
        return 
      }
      if(this.endTime == '' ){
        this.$api.msg('请输入卡券终止日期')
        return 
      }
      console.log(this.startStamp,this.endStamp)
      let startData = this.startTime.split(' ')
      let startStamp = startData[0].split('-').join('') + startData[1].split(':').join('')
      let endData = this.endTime.split(' ')
      let endStamp = endData[0].split('-').join('') + endData[1].split(':').join('')
      console.log(Number(startStamp),Number(endStamp))
      if( Number(startStamp) >=Number(endStamp)) {
        this.$api.msg('卡券终止日期需大于开始日期')
        return 
      }
      console.log(this.token)
      let params = {
        token: this.token || uni.getStorageSync('state_token'),
        type:this.index,
        use_start_time:this.startTime,
        use_end_time:this.endTime,
        count:this.couponQuantity,
        order_min_amount:this.totalPrice,
        money:this.cutPrice,
        home_display:this.switch_showindex ? 1 : 0
      }
      if(this.index==0){
          console.log(this.startTime,this.endTime)
          this.addCoupon(params)
      }else if(this.index==1){
          uni.navigateTo({
            url:`/pages/store_manage_comp/select_type?data=${JSON.stringify(params)}`
          })
      }else{
        uni.navigateTo({
          url:`/pages/store_manage_comp/select_goods?data=${JSON.stringify(params)}`
        })
      }
    },
    bindPickerChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.target.value);
      this.isPickerdefText = false
      this.index = e.target.value;
      switch (e.target.value){
        case '0' :
          this.confirmText = '确定'
          break;
        case '1' :
          this.confirmText = '选择品类'
          break;
        case '2' :
          this.confirmText = '选择商品'
          break;  
      }
    }
  }
};
</script>

<style lang="scss">
@import 'mixin.scss';
 .cut-section{
     width: 100%;
     height: 76rpx;
     color: #333537;
     font-size: 26rpx;
     margin-bottom: 30rpx;
     line-height: 76rpx;
     @include flexSB;
     .cut-l {
       width: 234rpx;
       padding-left: 30rpx;
     }
     .cut-r{
      flex: 1;
      height: 100%; 
      font-size:26rpx;
      @include flexSB;
      .input-section{
        width: 130rpx;
        border:1px solid rgba(206, 206, 206, 1);
        border-radius:6rpx;
        input {
          width: 100%;
          font-size: 26rpx;
          height: 46rpx;
          text-align: center;
        }
      }
     }
 }
 .order-section{
   padding: 45rpx;
   color: #333537;
   font-size: 26rpx;
  .item {
    width: 100%;
    height: 76rpx;
    margin-bottom: 30rpx;
    line-height: 76rpx;
    @include flexSB;
    border: 1px solid rgba(206, 206, 206, 1);
    border-radius: 6rpx;
    .item-l {
      width: 234rpx;
      padding-left: 30rpx;
      &.date{
        width: 50%;
      }
      .tip{
        text{
          color: #F0563D;
        }
      }
    }
    .item-r {
      flex: 1;
      height: 100%;
      .picker-section,.input-section {
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
          .choose-text{
            height: 100%;
            padding-right: 30rpx;
            @include flexSB;
            color: #CCCCCC;
          }
        }
      }
        .box-time{
         width: 100%;
         height:76rpx; 
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
</style>
