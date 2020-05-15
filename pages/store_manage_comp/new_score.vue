<template>
  <view class="container">
    <view class="order-section">
      <view class="item">
        <view class="item-l">
          <text class="tip">
            商品类目
            <text class="idot">*</text>
            ：
          </text>
        </view>
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
      <view class="item">
        <view class="item-l">
          <text class="tip">
            商品标题
            <text class="idot">*</text>
            ：
          </text>
        </view>
        <view class="item-r">
          <view class="input-section"><input type="text" v-model="goodsInfo.title" maxlength="11" placeholder="请输入商品标题" value="" /></view>
        </view>
      </view>
      <view class="exaddress-section mb">
        <text class="tip">
          商品规格
          <text class="idot">*</text>
        </text>
        <view class="speciflist">
          <!-- :class="{active:item.checked}" [index==specifId ? 'active':''] -->
          <view v-for="(item, index) in specifList" :class="{ active: index == specifId }" :key="index" @click.self="_confirmspecif(item, index)">
            {{ item.specifName }}
            <text v-if="item.specifName != '默认'" @click="_deleteSpecif(item, index)" class="cuIcon-roundclosefill"></text>
          </view>
          <view @click="_addsPecif">+新增</view>
        </view>
      </view>
      <!--  -->
      <view class="exaddress-section mb">
        <text class="tip">
          填写兑换商品积分和价格
          <text class="idot">*</text>
        </text>
        <view class="goods_cs">
          <view class="goods-item">
            <view class="item-l">积分</view>
            <view class="item-r"><input type="number" v-model="goodsInfo.score" placeholder="请输入积分" value="" /></view>
          </view>
          <view class="goods-item">
            <view class="item-l">价格</view>
            <view class="item-r"><input type="number" v-model="goodsInfo.cutPrice" placeholder="请输入价格" value="" /></view>
          </view>
        </view>
      </view>
      <!--  -->
      <view class="item">
        <view class="item-l">
          <text class="tip">
            商品数量
            <text class="idot">*</text>
            ：
          </text>
        </view>
        <view class="item-r">
          <view class="input-section"><input type="number" v-model="goodsInfo.quantity" maxlength="11" placeholder="请输入商品数量" value="" /></view>
        </view>
      </view>
      <!--  -->
      <view class="swiper-section">
        <text class="tip">选择商品轮播图（最多3张）</text>
        <view class="swiper-inner">
          <view class="grid col-4 grid-square flex-sub">
            <view class="bg-img" v-for="(item, index) in swiperList" :key="index" @tap="ViewImage" :data-url="swiperList[index]">
              <image :src="swiperList[index]" mode="aspectFill"></image>
              <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index"><text class="cuIcon-close"></text></view>
            </view>
            <view class="solids" @tap="ChooseImage" v-if="swiperList.length < 3"><text class="cuIcon-cameraadd"></text></view>
          </view>
        </view>
        <view class="max-tip">
          照片大小不可超过5MB
        </view>
      </view>
      <!--  -->
      <view class="swiper-section">
        <text class="tip">选择商品详情图文（最多5张）</text>
       <view class="swiper-inner">
         <view class="grid col-4 grid-square flex-sub">
           <view class="bg-img" v-for="(item, index) in swiperDetailList" :key="index" @tap="ViewImage1" :data-url="ChooseImage1[index]">
             <image :src="swiperDetailList[index]" mode="aspectFill"></image>
             <view class="cu-tag bg-red" @tap.stop="DelImg1" :data-index="index"><text class="cuIcon-close"></text></view>
           </view>
           <view class="solids" @tap="ChooseImage1" v-if="swiperDetailList.length < 5"><text class="cuIcon-cameraadd"></text></view>
         </view>
       </view>
       <view class="max-tip">
         照片大小不可超过5MB
       </view>
      </view>
      <!--  -->
    </view>
    <view class="btn-section"><button class="cu-btn round" @click="_confirm">保存</button></view>
    <!--  -->
    <tui-modal :show="isaddSpecifModal" @cancel="hideSpecifModal" :custom="true" :fadein="true">
      <view class="tui-modal-custom">
        <input placeholder="请输入商品规格" class="tui-input" v-model="specifData" />
        <tui-button shape="circle" type="danger" @click="_submitSpecif" size="small">立即提交</tui-button>
      </view>
    </tui-modal>
    <tui-modal :show="isgoodsInfoModal" @cancel="hidegoodsInfoModal" :custom="true" :fadein="true">
      <view class="tui-modal-custom">
     <!--   <view class="tui-item">
          <view class="tui-prompt-title">添加商品规格</view>
          <input placeholder="请输入商品规格" class="tui-input" v-model="newgoods.specifi" />
        </view> -->
        <view class="tui-item">
          <view class="tui-prompt-title">添加商品积分</view>
          <input placeholder="请输入商品积分" type="number" class="tui-input" v-model="newgoods.score" />
        </view>
        <view class="tui-item">
          <view class="tui-prompt-title">价格</view>
          <input placeholder="请输入商品价格" type="number" class="tui-input" v-model="newgoods.price" />
        </view>
        <view class="tui-item">
          <view class="tui-prompt-title">添加商品数量</view>
          <input placeholder="请输入商品数量" type="number" class="tui-input" v-model="newgoods.quantity" />
        </view>

        <tui-button shape="circle" type="danger" @click="_submitgoodsInfo">确定</tui-button>
      </view>
    </tui-modal>
  </view>
</template>

<script>
import timeSelector from '@/components/wing-time-selector/wing-time-selector.vue';
import tuiButton from '@/components/ThorUI/button/button';
import tuiModal from '@/components/ThorUI/modal/modal';
export default {
  components: {
    timeSelector,
    tuiButton,
    tuiModal
  },
  data() {
    return {
      array: ['日用家居', '酒水饮料', '家用电器', '数码配件', '户外运动', '生活服务', '美容美妆', '母婴玩具', '箱包配饰', '虚拟礼品', '其他'],
      index: 0,
      goodsInfo: {
        title: '', ///标题
        score: '',
        cutPrice: 0,
        quantity: '',
        swiper: [],
        swiperDetail: []
      },
      newgoods: {
        //新增商品规格 价格等参数
        specifi: '',
        price: '',
        quantity: '',
        score:''
      },
      isaddSpecifModal: false, //添加商品规格弹窗
      specifData: '', //商品规格数据
      specifId: -1,
      specifList: [
        {
          specifName: '默认'
        }
      ],
      isgoodsInfoModal: false,
      newgoodsInfoList: [], //新建商品保存的列表
      swiperList: [],
      swiperDetailList:[]
    };
  },
  onLoad() {
    // new Date().setTime('timestamp' * 1000);
  },
  methods: {
    ChooseImage() {
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
          console.log(res.tempFiles[0].size);
          if (this.swiperList.length != 0) {
            this.swiperList = this.swiperList.concat(res.tempFilePaths);
            console.log(res, this.swiperList);
          } else {
            this.swiperList = res.tempFilePaths;
          }
          // uni.uploadFile({
          //     url: 'https://www.example.com/upload', //仅为示例，非真实的接口地址
          //     filePath: tempFilePaths[0],
          //     name: 'file',
          //     formData: {
          //         'user': 'test'
          //     },
          //     success: (uploadFileRes) => {
          //         console.log(uploadFileRes.data);
          //     }
          // });
        }
      });
    },
    ChooseImage1() {
      uni.chooseImage({
        count:5, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: res => {
          let size = res.tempFiles[0].size;
          if (size > 1500000) {
            this.$api.msg('大小超过限制');
            return;
          }
          console.log(res.tempFiles[0].size);
          if (this.swiperDetailList.length != 0) {
            this.swiperDetailList = this.swiperDetailList.concat(res.tempFilePaths);
            console.log(res, this.swiperDetailList);
          } else {
            this.swiperDetailList = res.tempFilePaths;
          }
        }
      });
    },
    ViewImage(e) {
      uni.previewImage({
        urls: this.swiperList,
        current: e.currentTarget.dataset.url
      });
    },
    ViewImage1(e) {
      uni.previewImage({
        urls: this.swiperDetailList,
        current: e.currentTarget.dataset.url
      });
    },
    DelImg(e) {
      this.swiperList.splice(e.currentTarget.dataset.index, 1);
    },
    DelImg1(){
      this.swiperDetailList.splice(e.currentTarget.dataset.index, 1);
    },
    _addsPecif() {
      this.isaddSpecifModal = true;
    },
    // 新建商品信息
    _submitgoodsInfo() {
      // if (this.newgoods.specifi.trim() === '') {
      //   this.$api.msg('请输入商品规格');
      //   return;
      // }
      if (this.newgoods.score.trim() === '') {
        this.$api.msg('请输入商品积分');
        return;
      }
      if (this.newgoods.price.trim() === '') {
        this.$api.msg('请输入商品价格');
        return;
      }
      if (this.newgoods.quantity.trim() === '') {
        this.$api.msg('请输入商品数量');
        return;
      }
      let newgoods = Object.assign(this.newgoods, this.specifList[this.specifId]);
      this.newgoodsInfoList.push(newgoods);
      console.log(this.newgoodsInfoList);
      this.isgoodsInfoModal = false;
    },
    // 新建商品规格
    _submitSpecif() {
      if (this.specifData.trim() == '') {
        this.$api.msg('请输入商品规格');
        return;
      }
      this.specifList.push({
        specifName: this.specifData
      });
      this.specifData = '';
      this.isaddSpecifModal = false;
    },
    _confirmspecif(item, index) {
      this.specifId = index;
      if (item.specifName !== '默认') {
        this.isgoodsInfoModal = true;
      }
      // 点击商品规格同时
      // item.checked = !item.checked
    },
    _deleteSpecif(item, index) {
      if (index == this.specifId) this.specifId = -1;
      this.specifList.splice(index, 1);
    },
    hidegoodsInfoModal() {
      this.isgoodsInfoModal = false;
    },
    hideSpecifModal() {
      this.isaddSpecifModal = false;
    },
    bindPickerChange(e) {
      // this.isPickerdefText = false
      this.index = e.target.value;
    },
    _confirm() {
      if (this.goodsInfo.title.trim() === '') {
        this.$api.msg('请输入商品标题');
        return;
      }
      // if (this.goodsInfo.score.trim() === '') {
      //   this.$api.msg('请输入商品积分');
      //   return;
      // }
      if (this.goodsInfo.score - this.goodsInfo.cutPrice <= 0) {
        this.$api.msg('请输入正确的满减金额');
        return;
      }
      if (this.goodsInfo.quantity.trim() === '') {
        this.$api.msg('请输入商品数量');
        return;
      }
      console.log(this.goodsInfo);
      this.$api.msg('添加成功');
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
    .max-tip{
      color: #999999;
      font-size:20rpx;
    }
  }
  .exaddress-section {
    width: 100%;
    margin-bottom: 30rpx;
    &.mb {
      margin-bottom: 0rpx;
    }
    .goods_cs {
      @include flexX;
      justify-content: space-between;
      margin-top: 20rpx;
      flex-wrap: wrap;
      .goods-item {
        @include flexSA;
        width: 320rpx;
        height: 76rpx;
        background: rgba(255, 255, 255, 0);
        border: 1px solid rgba(206, 206, 206, 1);
        border-radius: 6rpx;
        color: #333537;
        font-size: 30rpx;
        margin-bottom: 30rpx;
        .item-l {
          width: 40%;
          text-align: center;
        }
        .item-r {
          width: 60%;
        }
        input {
          font-size: 26rpx;
        }
      }
    }
    .speciflist {
      width: 100%;
      margin-top: 20rpx;
      @include flexX;
      flex-wrap: wrap;
      > view {
        color: #999999;
        position: relative;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        font-size: 26rpx;
        padding: 18rpx 35rpx;
        border: 1px solid rgba(204, 204, 204, 1);
        border-radius: 6rpx;
        &.active {
          border: 1px solid rgba(230, 83, 90, 1);
          color: #e6535a;
        }
        .cuIcon-roundclosefill {
          position: absolute;
          font-size: 28rpx;
          right: -15rpx;
          top: -10rpx;
          color: #f54646;
        }
      }
    }
    .textarea-inner {
      margin-top: 20rpx;
      width: 660rpx;
      height: 120rpx;
      background: rgba(249, 249, 249, 1);
      border: 1px solid rgba(206, 206, 206, 1);
      border-radius: 6rpx;
      padding: 15rpx 15rpx 0;
      .textarea {
        width: 100%;
        height: 100%;
        font-size: 26rpx;
      }
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
