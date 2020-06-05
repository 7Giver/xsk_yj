<template>
  <view class="container">
    <view class="address-section">
      <image class="line" src="/static/line.png" mode=""></image>
      <view class="pick">
        <view class="article pic_bg">送</view>
        <view class="content">
          <view class="textarea"><textarea value="" placeholder="请输入送达地址" /></view>
        </view>
        <image class="icon_location" src="../../static/icon_location.png" mode=""></image>
      </view>
      <view class="receiver">
        <view class="article re_bg">存</view>
        <view class="content">
          <view class="textarea"><textarea value="" v-model="receiveAddress" placeholder="请输入寄存地址" /></view>
        </view>
        <view class="right-sec" @click.stop="openAddres"><text class="yticon icon-you"></text></view>
      </view>
    </view>
    <view class="service-item time" @click.stop="_showMask">
      <text class="ser-l">服务时间</text>
      <view class="ser-r">
        <text class="time">{{ sendTime }}</text>
        <hTimeAlert
          title="预约服务时间"
          subhead=""
          rangeStartTime="8:00:00"
          rangeEndTime="22:00:00"
          defaultTime="2020/3/29 18:00:00"
          intervalTime="30"
          dayStartIntTime="0"
          rangeDay="10"
          disabled="0,2"
          :isShow="isShow"
          :maskHide="maskHide"
          :rangeType="rangeType"
          :closeBtn="closeBtn"
          @_maskClose="maskClose"
          @closeAlert="handelClose"
        ></hTimeAlert>
        <text class="yticon icon-you"></text>
      </view>
    </view>
    <view class="tb-list">
      <view class="service-item "><text class="ser-l">物品</text></view>
      <view class="input-inner"><textarea value="" v-model="goodsMsg" placeholder="请输入寄存的物品" /></view>
    </view>
    <view class="service-item time">
      <text class="ser-l">取货方式</text>
      <view class="ser-r">
        <view class="receive_way">
          <button type="default" class="cu-btn" :class="{'active':way_id == 1}" @click="_changeWay(1)">自提</button>
          <button type="default" class="cu-btn" :class="{'active':way_id == 2}" @click="_changeWay(2)">送货上门</button>
        </view>
      </view>
    </view>
    <view class="aggrement-section" v-if="way_id==2">
      <checkbox-group class="block" @change="checkboxChange">
        <checkbox class="round red" style="transform:scale(0.6)" :class="checkbox.checked ? 'checked' : ''" :checked="checkbox.checked ? true : false" value="isRead"></checkbox>
      </checkbox-group>
      <text @click.stop="_toAgreement">请阅读并同意 <text style="color: #5280E0;">《送货上门服务协议》</text></text>
    </view>
    <view style="height: 70px"></view>
    <view class="footer">
      <view class="price-content">
        <text class="price" v-if="way_id==2">价格面议</text>
      </view>
      <!-- <text class="submit" @click="submit">提交订单</text> -->
      <button class="cu-btn submit" :disabled="disabled" @click="submit">提交订单</button>
    </view>
    <simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor="#007AFF"></simple-address>
  </view>
</template>

<script>
import simpleAddress from '@/components/simple-address/simple-address.vue';
import hTimeAlert from '@/components/h-time-alert/h-time-alert.vue';
export default {
  components: { hTimeAlert, simpleAddress },
  data() {
    return {
      optData: {},
      userRemark: [],
      isShow: false,
      maskHide: false,
      closeBtn: false,
      rangeType: true,
      sendTime: '',
      sendTime1: '',
      order_price: 100,
      disabled: false,
      cityPickerValueDefault: [0, 0, 1],
      receiveAddress: '',
      goodsMsg: '',
      way_id:2,
      checkbox:{
        value: 'isRead',
        checked: false
      },
      isChecked:false
    };
  },
  onLoad(options) {
    this.optData = JSON.parse(options.optData);
    this.goodsMsg = this.optData.value || '';
    console.log(this.optData);
  },
  methods: {
    _toAgreement(){
      uni.navigateTo({
        url:'/pages/aggrement/aggrement'
      })
    },
    checkboxChange(e) {
      var items = this.checkbox,
        values = e.detail.value;
        items.checked = !items.checked
        this.isChecked = values.length>0 ?true:false
    },
    _changeWay(id){
      this.way_id = id
    },
    openAddres() {
      this.cityPickerValueDefault = [0, 0, 0];
      this.$refs.simpleAddress.open();
    },
    onConfirm(e) {
      let labelArr = e.labelArr;
      this.receiveAddress = labelArr.join('');
    },
    submit() {
      if(!this.isChecked && this.way_id == 2){
        this.$api.msg('请阅读并同意用户协议')
        return
      }
      if(this.pickAddress == ''){
        this.$api.msg('请输入送达地址~')
        return
      }
      if(this.receiveAddress == ''){
        this.$api.msg('请输入寄存地址~')
        return
      }
      if(!this.sendTime){
        this.$api.msg('请选择服务时间~')
        return
      }
      this.addOrder()
    },
    addOrder(){
      var _this = this
      this.disabled = true
      // type:备注类型:1=洗衣,3=快递,4=代取件
      let service_details = JSON.stringify([{
          fetch_method: this.way_id == 1 ? 'oneself' : 'delivery',
        }])
      this.$http
        .post(`/addons/microlife/order/add`,{
          type:this.optData.type,
          user_remark:this.user_remark,
          pull_address:this.pickAddress,
          send_address:this.receiveAddress,
          service_start_time:this.sendTime1,
          service_details:service_details
        })
        .then(response => {
          const data = response.data
          if (response.code === 1) {
              this.$api.msg('下单成功~')
              setTimeout(()=>{
                uni.navigateTo({
                  url:`/pages/appoint/home?page=appoint-order`
                })
              },500)
          }
        });
    },
    _showMask() {
      this.isShow = !this.isShow;
    },
    maskClose() {
      this.isShow = false;
    },
    handelClose(data) {
      this.isShow = false;
      this.sendTime = data._dateRange;
      this.sendTime1 = data._date;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'mixin.scss';
page,
.container {
  background-color: #f7f9fb;
}
.container {
  padding: 0 30rpx;
}
.icon-you {
  color: #b5b7c7;
}
.aggrement-section{
  margin-top: 15rpx;
  @include flexX;
  @include flexA;
  color: #999;
  font-size: 26rpx;
  justify-content: flex-end;
}
.address-section {
  padding: 0 30rpx 30rpx;
  border-radius: 6rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
  .line {
    width: 690rpx;
    height: 8rpx;
  }
  .receiver,
  .pick {
    @include flexX;
    @include flexA;
    font-size: 32rpx;
    color: #131a31;
    .article {
      width: 44rpx;
      height: 44rpx;
      line-height: 44rpx;
      border-radius: 50%;
      font-size: 26rpx;
      text-align: center;
      color: #fff;
      &.re_bg {
        background: rgba(246, 79, 87, 1);
      }
      &.pic_bg {
        background: #1795ff;
      }
    }
  }
  .content {
    flex: 1;
    margin: 0 50rpx 0 40rpx;
    .textarea {
      width: 100%;
      textarea {
        width: 90%;
        font-size: 24rpx;
        height: 110rpx;
        padding: 20rpx 0;
      }
    }
  }
  .right-sec {
    width: 50rpx;
    height: 50rpx;
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    margin-top: 12rpx;
    text {
      float: right;
    }
    // justify-content: flex-end;
  }
  .icon_location {
    width: 24rpx;
    height: 32rpx;
  }
}
.tb-list {
  background-color: #fff;
  margin-bottom: 20rpx;
  .service-item {
    padding-top: 30rpx;
    margin-bottom: 0;
  }
  .input-inner {
    padding: 0 30rpx;
  }
}
.input-inner {
  flex: 1;
  textarea {
    width: 90%;
    font-size: 24rpx;
    height: 110rpx;
    padding: 20rpx 0;
  }
}
.price-section {
  background-color: #fff;
  padding: 40rpx 0;
  .service-item {
    margin-bottom: 0;
    &.coupon {
      margin-top: 40rpx;
    }
    .price-text {
      font-size: 28rpx;
      color: #f75347;
    }
    .coupon-text {
      font-size: 26rpx;
      color: #757e90;
    }
  }
}
.service-item {
  position: relative;
  padding: 0 30rpx;
  border-radius: 6rpx;
  @include flexSB;
  background-color: #fff;
  margin-bottom: 20rpx;
  &.time {
    height: 110rpx;
  }
  .ser-l {
    width: 22%;
    font-weight: bold;
  }

  .ser-r {
    flex: 1;
    color: #757e90;
    position: relative;
    @include flexX;
    justify-content: flex-end;
    .receive_way{
      button{
        width:140rpx;
        height:66rpx;
        padding: 0;
        font-size: 26rpx;
        border-radius:14rpx;
        background:rgba(255,255,255,1);
        border:1px solid rgba(193, 197, 204, 1);
        color: #757E90;
        &:first-child{
          margin-right: 20rpx;
        }
        &.active{
         background:rgba(255,255,255,1);
         border:1px solid rgba(236, 202, 157, 1); 
        }
      }
    }
  }
}
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 9;
  display: flex;
  align-items: center;
  width: 100%;
  height: 110rpx;
  justify-content: space-between;
  font-size: 32rpx;
  background-color: #fff;
  z-index: 5;
  color: $font-color-base;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
  .price-content {
    padding-left: 30rpx;
  }
  .price-tip {
    color: $base-color;
    margin-left: 8rpx;
  }
  .price {
    font-size: 36rpx;
    color: $base-color;
  }
  .submit {
    width: 200rpx;
    height: 74rpx;
    border-radius: 14rpx;
    margin-right: 40rpx;
    background: linear-gradient(90deg, rgba(247, 83, 71, 1), rgba(251, 73, 85, 1));
    font-size: 30rpx;
    color: #fff;
  }
}
</style>
