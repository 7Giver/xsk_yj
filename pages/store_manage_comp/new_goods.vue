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
            <picker @change="bindPickerChange" :value="index" :range="newcategoryList">
              <view v-if="isPickerdefText" class="choose-text">
                <text>请选择商品类目</text>
                <text class="cuIcon-unfold"></text>
              </view>
              <view class="uni-input" v-else>{{ newcategoryList[index] }}</view>
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
          <view class="input-section"><input type="text" v-model="goodsInfo.title" maxlength="20" placeholder="请输入商品标题" value="" /></view>
        </view>
      </view>
      <view class="item appoint">
        <view class="item-l">
          <text class="tip">
            是否开启商品预约服务时间
            <text class="idot">*</text>
            ：
          </text>
        </view>
        <view class="item-r">
          <view class="picker-section">
            <picker @change="bindappointChange" :value="is_can_appoint" :range="appointList">
              <view class="uni-input">{{ appointList[is_can_appoint] }}</view>
            </picker>
          </view>
        </view>
      </view>
      <!--  -->
      <view class="exaddress-section">
        <text class="tip">
          商品卖点
          <text class="idot">*</text>
        </text>
        <view class="textarea-inner"><textarea class="textarea" maxlength="80" v-model="goodsInfo.selling" placeholder="请输入商品卖点" /></view>
      </view>
      <view class="exaddress-section mb">
        <text class="tip">
          填写商品参数
          <text class="idot">*</text>
        </text>
        <view class="goods_cs">
          <view class="goods-item">
            <view class="item-l">品牌</view>
            <view class="item-r"><input type="text" v-model="goodsInfo.params.brand" maxlength="11" placeholder="请输入品牌" value="" /></view>
          </view>
          <view class="goods-item">
            <view class="item-l">型号</view>
            <view class="item-r"><input type="text" v-model="goodsInfo.params.model" maxlength="11" placeholder="请输入型号" value="" /></view>
          </view>
          <view class="goods-item">
            <view class="item-l">颜色</view>
            <view class="item-r"><input type="text" v-model="goodsInfo.params.color" maxlength="11" placeholder="请输入颜色" value="" /></view>
          </view>
          <view class="goods-item">
            <view class="item-l">材质</view>
            <view class="item-r"><input type="text" v-model="goodsInfo.params.material" maxlength="11" placeholder="请输入材质" value="" /></view>
          </view>
        </view>
      </view>
      <!--  -->
      <view class="exaddress-section mb">
        <text class="tip">
          商品规格(选填)
          <!-- <text class="idot">*</text> -->
        </text>
        <view class="speciflist">
          <!-- :class="{active:item.checked}" [index==specifId ? 'active':''] -->
          <view>默认</view>
          <view v-for="(item, index) in specifList" :class="{ active: index == specifId }" :key="index" @click="_confirmspecif(item, index)">
            {{ item.value }}
            <!-- <text  @click.stop="_deleteSpecif(item, index)" class="cuIcon-roundclosefill"></text> -->
            <image src="https://cdn.swh296.com/img/iconList/delete_active.png" @click.stop="_deleteSpecif(item, index)" mode=""></image>
          </view>
          <view @click="_addsPecif">+新增</view>
        </view>
      </view>
      <view class="exaddress-section mb">
        <text class="tip">
          填写商品价格/库存
          <text class="idot">*</text>
        </text>
        <view class="goods_cs">
          <view class="goods-item">
            <view class="item-l">原价</view>
            <view class="item-r"><input type="number" v-model="goodsInfo.oldPrice" placeholder="请输入原价" value="" /></view>
          </view>
          <view class="goods-item">
            <view class="item-l">折扣价</view>
            <view class="item-r"><input type="number" v-model="goodsInfo.cutPrice" placeholder="请输入折扣价" value="" /></view>
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
<!--     <view class="item">
        <view class="item-l">
          <text class="tip">
            商品编号
            <text class="idot">*</text>
            ：
          </text>
        </view>
        <view class="item-r">
          <view class="input-section"><input type="text" v-model="goodsInfo.serial" maxlength="11" placeholder="请输入商品编号" value="" /></view>
        </view>
      </view> -->
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
        <view class="max-tip">照片大小不可超过5MB</view>
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
        <view class="max-tip">照片大小不可超过5MB</view>
      </view>
      <!--  -->
    </view>
    <view class="btn-section"><button class="cu-btn round" :disabled="disabled" @click="_confirm">保存</button></view>
    <!--  -->
    <!--    <tui-modal :show="isaddSpecifModal" @cancel="hideSpecifModal" :custom="true" :fadein="true">
      <view class="tui-modal-custom">
        <input placeholder="请输入商品规格" class="tui-input" v-model="specifData" />
        <tui-button shape="circle" type="danger" @click="_submitSpecif" size="small">立即提交</tui-button>
      </view>
    </tui-modal> -->
    <tui-modal :show="isgoodsInfoModal" @cancel="hidegoodsInfoModal" :custom="true" :fadein="true">
      <view class="tui-modal-custom" v-if="isgoodsInfoModal">
        <view class="tui-item">
          <view class="tui-prompt-title">添加商品规格</view>
          <input placeholder="请输入商品规格" class="tui-input" v-model="newgoods.value" />
        </view>
        <view class="tui-item">
          <view class="tui-prompt-title">价格</view>
          <input placeholder="请输入商品价格" type="number" class="tui-input" v-model="newgoods.price" />
        </view>
        <view class="tui-item">
          <view class="tui-prompt-title">添加商品数量</view>
          <input placeholder="请输入商品数量" type="number" class="tui-input" v-model="newgoods.stock" />
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
import { mapState } from 'vuex';
let goodsId = 0
export default {
  components: {
    timeSelector,
    tuiButton,
    tuiModal
  },
  data() {
    return {
      isPickerdefText: true,
      categoryList: [],
      newcategoryList: [],
      appointList:[
        '不开启','开启'
      ],
      categoryId: -1,
      is_can_appoint:0,//是否开启预约服务时间
      index: 0,
      goodsInfo: {
        title: '', ///标题
        selling: '', //卖店
        params: {
          //参数
          color: '',
          brand: '',
          material: '',
          model: ''
        },
        oldPrice: '',
        cutPrice: '',
        quantity: '',
        serial: '', //编号
        swiper: [],
        swiperDetail: [],
        saveSwiper: [],
        saveswiperDetail: []
      },
      newgoods: {
        //新增商品规格 价格等参数
        price: '',
        stock:'',
        value:''
      },
      isaddSpecifModal: false, //添加商品规格弹窗
      specifData: '', //商品规格数据
      specifId: -1,
      specifList: [
        // {
        //   name: '默认'
        // }
      ],
      isgoodsInfoModal: false,
      newgoodsInfoList: [], //新建商品保存的列表
      swiperList: [],
      swiperDetailList: [],
      saveList: [],
      saveListDetail: [],
      isNewPecif: false,
      disabled:false
    };
  },
  computed: {
    ...mapState(['token'])
  },
  onLoad() {
    this.category();
  },
  methods: {
    // 新增商品规格
    _addsPecif() {
      this.isgoodsInfoModal = true;
      this.isNewPecif = false;
    },
    // 自己填写的
    _confirmspecif(item, index) {
      console.log(item)
      this.specifId = index;
      this.newgoods = item
      this.isNewPecif = true;
      this.isgoodsInfoModal = true;
    },
    // 新建商品信息 规格
    _submitgoodsInfo() {
      if (this.newgoods.value.trim() === '') {
        this.$api.msg('请输入商品规格');
        return;
      }
      if (this.newgoods.price.trim() === '') {
        this.$api.msg('请输入商品价格');
        return;
      }
      if (this.newgoods.stock.trim() === '') {
        this.$api.msg('请输入商品数量');
        return;
      }
      let obj = Object.assign({id:goodsId++},this.newgoods)
      console.log(obj)
      if(!this.isNewPecif){
        this.specifList.push(obj)
      } else {
        console.warn('this.specifId',this.specifId)
        this.specifList[this.specifId] = obj
      }
      console.log(this.specifList)
      this.isgoodsInfoModal = false;
      this.specifId = -1;
    },

    _deleteSpecif(item, index) {
      if (index == this.specifId) this.specifId = -1;
      this.specifList.splice(index, 1);
    },
    hidegoodsInfoModal() {
      this.isgoodsInfoModal = false;
    },
    bindPickerChange(e) {
      this.isPickerdefText = false;
      this.index = e.target.value;
      this.categoryId = this.categoryList[this.index].category.id;
      console.log(this.categoryId);
    },
     bindappointChange (e){
       this.is_can_appoint = e.target.value
     },
    _confirm() {
      if (this.isPickerdefText) {
        this.$api.msg('请选择商品类目');
        return;
      }
      if (this.goodsInfo.title.trim() === '') {
        this.$api.msg('请输入商品标题');
        return;
      }
      if (this.goodsInfo.selling.trim() === '') {
        this.$api.msg('请输入商品卖点');
        return;
      }
      let params = this.goodsInfo.params;
      if (params.brand.trim() === '') {
        this.$api.msg('请输入商品品牌');
        return;
      }
      if (params.model.trim() === '') {
        this.$api.msg('请输入商品型号');
        return;
      }
      if (params.color.trim() === '') {
        this.$api.msg('请输入商品颜色');
        return;
      }
      if (params.material.trim() === '') {
        this.$api.msg('请输入商品材质');
        return;
      }
      if (this.goodsInfo.oldPrice.trim() === '') {
        this.$api.msg('请输入商品原价');
        return;
      }
      if (this.goodsInfo.cutPrice.trim() === '') {
        this.$api.msg('请输入商品折扣价');
        return;
      }
      if (this.goodsInfo.oldPrice - this.goodsInfo.cutPrice <= 0) {
        this.$api.msg('请输入正确的满减金额');
        return;
      }
      if (this.goodsInfo.quantity.trim() === '') {
        this.$api.msg('请输入商品数量');
        return;
      }
      // if (this.goodsInfo.serial.trim() === '') {
      //   this.$api.msg('请输入商品编号');
      //   return;
      // }
      if (this.saveList.length == 0) {
        this.$api.msg('请上传商品轮播图封面');
        return;
      }
      if (this.saveListDetail.length == 0) {
        this.$api.msg('请上传商品详情图片');
        return;
      }
      let newsaveList = this.saveList.join(',');
      let newsaveListDetail = this.saveListDetail.join(',');
      this.addProducts(newsaveList, newsaveListDetail);
    },
    addProducts(newsaveList, newsaveListDetail) {
      this.disabled = true
      var _this = this;
      uni.showLoading({
        title:'正在提交...'
      })
      this.$http
        .post(`/api/merchants/Products/add`, {
          category_id: this.categoryId,
          token: this.token,
          title: this.goodsInfo.title,
          description: this.goodsInfo.selling,
          parameter: JSON.stringify(_this.goodsInfo.params),
          market_price: this.goodsInfo.oldPrice,
          price: this.goodsInfo.cutPrice,
          stock: this.goodsInfo.quantity,
          sn: this.goodsInfo.serial,
          sku: JSON.stringify(this.specifList),
          image: newsaveList,
          content: newsaveListDetail,
          is_can_appoint:this.is_can_appoint
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            console.log('data', data);
            uni.hideLoading()
            this.disabled = false
            this.$api.msg('保存成功')
            setTimeout(()=>{
              uni.navigateBack({
                
              }) 
            },500)
          }else{
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
          // _this.uploadCommon(res.tempFiles[0],'swiper')
          uni.showLoading({
            title: '正在上传...'
          });
          uni.uploadFile({
            url: 'https://apis.53pzck.top/addons/qiniu/index/upload', //仅为示例，非真实的接口地址
            filePath: res.tempFilePaths[0],
            name: 'file',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            formData: {
              token: this.token
            },
            success: uploadFileRes => {
              // console.log(uploadFileRes.data);
              let uploadData = uploadFileRes.data;
              let data = JSON.parse(`${uploadFileRes.data}`);
              let url = data.data.url;
              this.saveList.push(url);
              console.log(this.saveList);
              uni.hideLoading();
            }
          });
          if (this.swiperList.length != 0) {
            this.swiperList = this.swiperList.concat(res.tempFilePaths);
            console.log(res, this.swiperList);
          } else {
            this.swiperList = res.tempFilePaths;
          }
        }
      });
    },
    ChooseImage1() {
      var _this = this;
      uni.chooseImage({
        count: 5, //默认9
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
            url: 'https://apis.53pzck.top/addons/qiniu/index/upload', //仅为示例，非真实的接口地址
            filePath: res.tempFilePaths[0],
            name: 'file',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            formData: {
              token: this.token
            },
            success: uploadFileRes => {
              console.log(uploadFileRes.data);
              let uploadData = uploadFileRes.data;
              let data = JSON.parse(`${uploadFileRes.data}`);
              let url = data.data.url;
              _this.saveListDetail.push(url);
              console.log(_this.saveListDetail);
              uni.hideLoading();
            }
          });
          if (this.swiperDetailList.length != 0) {
            this.swiperDetailList = this.swiperDetailList.concat(res.tempFilePaths);
            // console.log(res, this.swiperDetailList);
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
    DelImg1(e) {
      this.swiperDetailList.splice(e.currentTarget.dataset.index, 1);
    },
    uploadCommon(tempFiles) {
      console.log('tempFiles', tempFiles);
      uni.showLoading({
        title: '正在上传...'
      });
      uni.uploadFile({
        url: 'https://apis.53pzck.top/addons/qiniu/index/upload', 
        filePath: tempFiles,
        name: 'file',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        formData: {
          token: this.token
        },
        success: uploadFileRes => {
          // console.log(uploadFileRes.data);
          let uploadData = uploadFileRes.data;
          let data = JSON.parse(`${uploadFileRes.data}`);
          let url = data.data.url;
          _this.saveList.push(url);
          // console.log(_this.saveList);
          uni.hideLoading();
        }
      });
    },
    category() {
      this.$http
        .post(`/api/merchants/category/index`, {
          token: this.token
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            this.categoryList = data;
            let categoryData = this.categoryList.map((v, i) => {
              return v.category.name;
            });
            this.newcategoryList = categoryData;
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'mixin.scss';
/deep/.tui-modal-box {
  padding: 0 !important;
}
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
        height: 70rpx;
        line-height: 70rpx;
        position: relative;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        font-size: 26rpx;
        padding: 0rpx 35rpx;
        border: 1px solid rgba(204, 204, 204, 1);
        border-radius: 6rpx;
        .name{
          // padding: 0rpx 35rpx;
        }
        &.active {
          border: 1px solid rgba(230, 83, 90, 1);
          color: #e6535a;
        }
        image{
          position: absolute;
          width: 30rpx;
          height: 30rpx;
          right: -18rpx;
          top: -18rpx;
          color: #f54646;
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
    &.appoint{
      .item-l {
        width: 500rpx;
      }
    }
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
  margin: 20px 32px;
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
