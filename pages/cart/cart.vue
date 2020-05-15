<template>
  <view class="container">
    <!-- 空白页 -->
    <view v-if="empty == true && cartList.length == 0" class="empty">
      <image src="https://cdn.swh296.com/img/common/emptyCart.jpg" mode="aspectFit"></image>
      <view class="empty-tips">
        空空如也
        <navigator class="navigator" url="/pages/index/index" open-type="switchTab">随便逛逛></navigator>
      </view>
    </view>
    <!-- 列表 -->
    <view v-else class="cart-section">
      <!-- v-if="isDelay" -->
      <view class="cart-list" v-for="(item, index) in cartList" :key="item.id">
        <block>
          <view class="cart-top" :data-id="item.store.id"  @click="_gStore">
            <view class="yticon icon-xuanzhong2 checkbox" :class="{ checked: item.checked }" @click.stop="_checkStore(index)"></view>
            <text>{{ item.store.name }}</text>
          </view>
          <view class="cart-item" v-for="(sitem, sindex) in item.list" :key="sindex" :class="{ 'b-b': sindex !== cartList.length - 1 }" :data-id="sitem.product.id" @click="_toProduct">
            <view class="yticon icon-xuanzhong2 checkbox" :class="{ checked: sitem.checked }"  @click.stop="_checkGoods(sindex,index)"></view>
            <view class="image-wrapper">
              <image
                :src="sitem.product.image[0]"
                mode="aspectFill"
                :class="[sitem.loaded]"
                lazy-load 
                @load="onImageLoad('cartList', index)" 
                @error="onImageError('cartList', index)"
              ></image>
           <!--   :class="[sitem.loaded]"
              lazy-load
              @load="onImageLoad('cartList', index)"
              @error="onImageError('cartList', index)" -->
            </view>
            <view class="item-right" @click.stop>
              <text class="clamp title">{{ sitem.product.title }}</text>
              <text class="attr">{{ sitem.sku.value }}</text>
              <text class="price">¥{{ sitem.sku.price }}</text>
              <uni-number-box
                class="step"
                :min="1"
                :max="sitem.sku.stock"
                :value="sitem.quantity > sitem.sku.stock ? sitem.sku.stock : sitem.quantity"
                :isMax="sitem.quantity >= sitem.sku.stock ? true : false"
                :isMin="sitem.quantity === 1"
                :index="sindex"
                :indexStore="index"
                :productId="sitem.sku.id"
                data-id="sitem.sku.id"
                @eventChange="numberChange"
              ></uni-number-box>
            </view>
            <text class="del-btn yticon icon-fork" v-if="sitem.checked" :data-index="index" :data-id="sitem.id" :data-sindex="sindex" @click.stop="_delete"></text>
          </view>
        </block>
      </view>
      </view>
      <!-- 底部菜单栏 -->
      <view class="action-section" v-if="loaded && cartList.length>0">
        <view class="yticon icon-xuanzhong2 checkbox" :class="{ checked: allChecked }" @click="_checkAll('all')"></view>
        <view class="key_delete" @click="_keyDelete" v-if="checkIds.length>0">
          一键删除
        </view>
        <view class="checkbox" v-if="false">
       <!--   <image
            :src="allChecked ? 'https://cdn.swh296.com/img/iconList/selected.png' : 'https://cdn.swh296.com/img/iconList/select.png'"
            mode="aspectFit"
            @click="_checkAll('all')"
          ></image> -->
          <view class="clear-btn" :class="{ show: allChecked }" @click="clearCart">清空</view>
        </view>
        <view class="total-box">
          <text class="price">¥{{ total }}</text>
        <!--  <text class="coupon">
            已优惠
            <text>74.35</text>
            元
          </text> -->
        </view>
        <button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
      </view>
      <tui-modal :show="isSkuEmptyModal" @click="handleClickSku" @cancel="hideSku" :content="isSkuContent" :button="isSkuButton" :maskClosable="true"></tui-modal>
    </view>
  </view>
</template>

<script>
import { mapState,mapMutations } from 'vuex';
import uniNumberBox from '@/components/uni-number-box.vue';
import tuiModal from "@/components/ThorUI/modal/modal"
export default {
  components: {
    uniNumberBox,
    tuiModal
  },
  data() {
    return {
      loaded: false,
      total: 0, //总价格
      allChecked: false, //全选状态  true|false
      empty: false, //空白页现实  true|false
      cartList: [],
      isDelay:true,
      checkIds:[],
      isSkuButton: [{
      	text: "确定",
      	type: 'red'
      }],
      isSkuEmptyModal:false,
      isSkuContent:''
    };
  },
  computed:{
    ...mapState(['hasLogin', 'token'])
  },
  onShow() {
    // let token = this.token || uni.getStorageSync('state_token')
    this.getCartList()
  },
  watch: {
    // cartList(e) {
    //   console.log('e', e);
    //   let empty = !e ? true : false
    //   if (this.empty !== empty) {
    //     this.empty = empty;
    //   }
    // }
  },
  methods: {
    ...mapMutations(['setStoreId']),
    hideSku(){
      this.isSkuEmptyModal = false
    },
    handleClickSku(){
      this.isSkuEmptyModal = false
    },
    edit(changeData) {
      this.$http
        .post(`/addons/xshop/cart/edit`, {
          token: this.token,
          sku_id: changeData.productId,
          quantity: changeData.number
        })
        .then(response => {
          const data = response.data
          if (response.code === 1) {
            this.calcTotal()
          }else{
            this.$api.msg(response.msg)
          }
        })
    },
    _delete(e){
      var _this = this
      let dataset = e.currentTarget.dataset
      uni.showModal({
      	content: '确定删除该商品么？',
      	success: (res)=>{
      		if(res.confirm){
            _this.delete(dataset)
      		}
      	}
      })
    },
    delete(dataset) {
      this.$http
        .post(`/addons/xshop/cart/delete`, {
          token: this.token,
          ids: dataset.id
        })
        .then(response => {
          const data = response.data
          if (response.code === 1) {
            uni.showLoading({
              title: '删除成功~',
              duration:500
            })
            let list = this.cartList
            let index = dataset.index
            let sindex = dataset.sindex
            if(this.cartList[index].list.length==1){
              this.cartList.splice(index,1)
            }else{
              this.cartList[index].list.splice(sindex, 1);
            }
            this.calcTotal()
          }
        });
    },
    updateStatus(ids) {
      this.$http
        .post(`/addons/xshop/cart/updateStatus`, {
          token: this.token,
          ids:ids
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            uni.navigateTo({
              url: `/pages/order/createOrder`
            });
          }else if(response.code == 50005){
            this.isSkuContent = response.msg
            this.isSkuEmptyModal = true
          }
        })
    },
    clearList() {
      this.$http
        .post(`/addons/xshop/cart/clear`, {
          token: this.token
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            this.$api.msg('清空购物车成功~')
            this.empty = true
            this.cartList = [];
          }
        });
    },
    _keyDelete(){
      var _this = this
      if(this.allChecked){
        this.clearCart()
      }else{
        let checkIds = this.checkIds.join(',')
        uni.showModal({
          content: `你确定删除这${this.checkIds.length}件商品么？`,
          success: e => {
            if (e.confirm) {
              _this.cartdelete(checkIds)
            }
          }
        })
      }
    },
    cartdelete(checkIds){
      this.$http
        .post(`/addons/xshop/cart/delete`, {
          token: this.token,
          ids:checkIds
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            this.$api.msg('删除成功~')
            // let cartData = this.cartList.map(item => {
            //   item.list.filter(s=>!s.checked)
            //   return item
            // })
            // console.log('cartData',cartData)
            this.getCartList()
          }
        });
    },
    //获取购物车列表
    getCartList() {
      this.$http
        .post(`/addons/xshop/cart/list`, {
          token: this.token || uni.getStorageSync('state_token')
        })
        .then(response => {
          const data = response.data;
          console.log('response.data',data)
          if (response.code == 1) {
            this.loaded = true;
            if(data && data.length>0){
              let cartList = data.map(item => {
                // item.checked = true
                let data = item.list.every(s=>{
                  s.checked = s.is_selected
                  return s.checked
                })
                item.checked = data
                return item
              })
              this.cartList = cartList
              this.calcTotal()
            }else{
              this.empty = true
              this.cartList =[]
            }
          }
        })
    },
    //监听image加载完成
    onImageLoad(key, index) {
      // console.log('this[key][index]',this[key][index])
      this.$set(this[key][index], 'loaded', 'loaded');
    },
    //监听image加载失败
    onImageError(key, index) {
      this[key][index].image = 'https://cdn.swh296.com/img/common/errorImage.jpg';
    },
    _gStore(e){
      let id = e.currentTarget.dataset.id
      this.setStoreId(id)
       uni.navigateTo({
         url:`/pages/router-page/home?store_id=${id}&page='store-index'`
       })
      },
    _toProduct(e){
      let id = e.currentTarget.dataset.id
      uni.navigateTo({
      	url: `/pages/product/product?id=${id}`
      })
    },
    // 选中商铺
    _checkStore(index,item){
      let cartData = this.cartList
      let storeData = cartData[index].list
      if(cartData[index].checked){
        cartData[index].checked =false
        for (var i in storeData) {
          storeData[i].checked = false
        }
      }else{
        cartData[index].checked =true
        for (var i in storeData) {
          storeData[i].checked = true
        }
      }
      this.calcTotal()
    },
    // 选中商品
    _checkGoods(index,storeIndex){
      let cartData = this.cartList
      let storeData = cartData[storeIndex].list //当前所属的店铺
       if(storeData[index].checked){
         cartData[storeIndex].checked = false
         storeData[index].checked = false 
       }else{
         storeData[index].checked = true // //点击后当前店铺下当前商品的状态
         let storegoodsleg = storeData.length
         var selectedleg = 0
         for (var i in storeData) {
           if (storeData[i].checked == true) {
             selectedleg++
           }
         }
         if (storegoodsleg == selectedleg) {
           cartData[storeIndex].checked = true
         }
         // this.cartList = cartData
      } 
      this.calcTotal()
    },
    // 选中全部
    _checkAll(){
      const checked = !this.allChecked;
      const list = this.cartList;
      list.forEach(item => {
        item.checked = checked
        item.list.map(s=>{
          s.checked = item.checked 
        })
      })
      this.allChecked = checked
      this.calcTotal()
    },
    //数量
    numberChange(data) {
      this.cartList[data.indexStore].list[data.index].quantity = data.number
      // this.calcTotal()
      this.edit(data)
    },
    //删除
    deleteCartItem(index) {
      let list = this.cartList;
      let row = list[index];
      let id = row.id;

      this.cartList.splice(index, 1);
      this.calcTotal();
      uni.hideLoading();
    },
    //清空
    clearCart() {
      uni.showModal({
        content: '你确定清空购物车么？',
        success: e => {
          if (e.confirm) {
            // this.cartList = [];
            this.clearList();
          }
        }
      });
    },
    //计算总价
    calcTotal() {
      let list = this.cartList;
      if (list.length == 0) {
        this.empty = true;
        return
      }
      let total = 0
      let checkIds = []
      list.forEach(item => {
        item.list.forEach(s=>{
            if (s.checked) {
              checkIds.push(s.id)
              total += s.sku.price * s.quantity
            } 
        })
      })
      this.checkIds = checkIds
      let allChecked =  list.every(item =>item.checked)
      this.total = Number(total.toFixed(2))
      this.allChecked = allChecked
    },
    //创建订单
    createOrder() {
      let list = []
      let cartList = this.cartList.map(item => {
        item.list.map(s=>{
          if(s.checked){
            list.push(s)
          }
        })
      })
      if(list.length==0){
        this.$api.msg('请选择结算的商品~')
        return
      }else{
        let type = ''
        if(this.allChecked) {
         type = 'all'
        }else{
          let typeIds = []
          list.forEach(v=>{
            typeIds.push(v.id)
          })
          type = typeIds.join(',')
        }
        this.updateStatus(type)
      }
    }
  }
};
</script>

<style lang="scss">
@import 'mixin.scss';
.container {
  padding-bottom: 134rpx;
  /* 空白页 */
  .empty {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    padding-bottom: 100rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background: #fff;
    image {
      width: 240rpx;
      height: 160rpx;
      margin-bottom: 30rpx;
    }
    .empty-tips {
      display: flex;
      font-size: $font-sm + 2rpx;
      color: $font-color-disabled;
      .navigator {
        color: $uni-color-primary;
        margin-left: 16rpx;
      }
    }
  }
}
/* 购物车列表项 */
.cart-section {
  .cart-list {
    width: 710rpx;
    margin: 20rpx auto 0;
    background: rgba(255, 255, 255, 1);
    border-radius: 10rpx;
    .cart-top {
      margin: 0 25rpx;
      height: 90rpx;
      border-bottom: 1px solid #e8e8e8;
      @include flexX;
      font-size: 28rpx;
      .checkbox {
        font-size: 44rpx;
        line-height: 1;
        padding: 4rpx;
        color: $font-color-disabled;
        background: #fff;
        border-radius: 50px;
        margin-right: 30rpx;
        &.checked{
          color: #EA543E
        }
      }
    }
    .cart-item {
      @include flexX;
      @include flexA;
      display: flex;
      position: relative;
      padding: 30rpx 0rpx;
      margin: 0 25rpx;
      .image-wrapper {
        width: 158rpx;
        height: 158rpx;
        flex-shrink: 0;
        position: relative;
        image {
          border-radius: 6rpx;
          opacity: 1;
        }
      }
      .checkbox {
        font-size: 44rpx;
        line-height: 1;
        padding: 4rpx;
        color: $font-color-disabled;
        background: #fff;
        border-radius: 50px;
        margin-right: 30rpx;
        &.checked{
          color: #EA543E;
        }
      }
      .item-right {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
        position: relative;
        padding-left: 30rpx;
        .title,
        .price {
          font-size: $font-base + 2rpx;
          color: $font-color-dark;
          height: 40rpx;
          line-height: 40rpx;
        }
        .title{
          width: 80%;
        }
        .attr {
          font-size: $font-sm + 2rpx;
          color: $font-color-light;
          height: 50rpx;
          line-height: 50rpx;
        }
        .price {
          height: 50rpx;
          line-height: 50rpx;
        }
        // .step{
          .uni-numbox{
            right: 30rpx !important;
          }
        // }
      }
      .del-btn {
        position: absolute;
        right: 20rpx;
        top: 30rpx;
        padding: 4rpx 10rpx;
        font-size: 34rpx;
        height: 50rpx;
        color: $font-color-light;
      }
    }
  }
}
/* 底部栏 */
.action-section {
  /* #ifdef H5 */
  margin-bottom: 100rpx;
  /* #endif */
  position: fixed;
  left: 20rpx;
  bottom: 30rpx;
  z-index: 5;
  display: flex;
  align-items: center;
  width: 710rpx;
  height: 100rpx;
  // margin: 0 25rpx;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.5);
  border-radius: 16rpx;
  box-sizing: border-box;
  .checkbox {
    font-size: 44rpx;
    line-height: 1;
    padding: 4rpx;
    color: $font-color-disabled;
    background: #fff;
    border-radius: 50px;
    margin:0 30rpx 0 25rpx;
    &.checked{
      color: #EA543E
    }
  }
  .key_delete{
    font-size: 32rpx;
    color: #EA543E;
    height: 100rpx;
    line-height: 100rpx;
  }
  // .checkbox {
  //   height: 52rpx;
  //   position: relative;
  //   image {
  //     width: 52rpx;
  //     height: 100%;
  //     position: relative;
  //     z-index: 5;
  //   }
  // }
  .clear-btn {
    position: absolute;
    left: 26rpx;
    top: 0;
    z-index: 4;
    width: 0;
    height: 52rpx;
    line-height: 52rpx;
    padding-left: 38rpx;
    font-size: $font-base;
    color: #fff;
    background: $font-color-disabled;
    border-radius: 0 50px 50px 0;
    opacity: 0;
    transition: 0.2s;
    &.show {
      opacity: 1;
      width: 120rpx;
    }
  }
  .total-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    text-align: right;
    padding-right: 40rpx;
    .price {
      font-size: $font-lg;
      color: $font-color-dark;
    }
    .coupon {
      font-size: $font-sm;
      color: $font-color-light;
      text {
        color: $font-color-dark;
      }
    }
  }
  .confirm-btn {
    padding: 0 38rpx;
    margin: 0;
    border-radius: 100px;
    height: 76rpx;
    line-height: 76rpx;
    font-size: $font-base + 2rpx;
    background: $uni-color-primary;
    box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72);
  }
}
/* 复选框选中状态 */
.action-section .checkbox.checked,
.cart-item .checkbox.checked {
  color: $uni-color-primary;
}
</style>
