<template>
  <view class="container">
    <view class="serach-section">
      <view class="search-box">
        <!-- <image src="http://cdn.swh296.com/img/iconList/search.png" class="search" mode=""></image> -->
        <text class="cuIcon-search search"></text>
        <input type="text" v-model="keyword" placeholder="搜索" @input="inputChange" value="" />
        <text class="cuIcon-roundclose close" v-if="keyword.trim()" @click="_delete"></text>
      </view>
    </view>
    <view class="order-section">
      <view class="item" v-for="(item, index) in list" :key="index">
        <text class="icon" :class="[item.checked ? 'cuIcon-roundcheckfill' : 'cuIcon-round']" @click="check('item', index)"></text>
        <image :src="item.image[0]" class="cover" mode=""></image>
          <view class="content">
            <text class="title">{{item.title}}</text>
            <view class="num-inner">
              <text class="price">¥{{item.price}}</text>
              <text class="stock" v-if="item.stock">库存: {{item.stock}}</text>
            </view>
          </view>
        </view>
    </view>
    <view class="splitCls" style="height: 70px"></view>
    <view class="btn-section">
      <button class="cu-btn round bg-red lg" :disabled="disabled" @click="_confirm">确定</button>
    </view>
    <empty setSrc="https://cdn.swh296.com/img/common/empty_content.png" v-if="loaded === true && list.length === 0">
      <view class="empty-text">
        暂无商品
      </view>
    </empty>
  </view>
</template>

<script>
let timer = null;
import {addCoupon} from '../../common/js/commonInfo.js';
import empty from '../../components/empty.vue'
import {mapState} from 'vuex';
export default {
  components:{empty},
  data() {
    return {
      tabList: [
        {
          text: '售卖中',
          id: 1
        },
        {
          text: '已下架',
          id: 2
        },
        {
          text: '推荐商品',
          id: 3
        },
        {
          text: '全部',
          id: 4
        }
      ],
      tabId: 1,
      keyword: '',
      list: [],
      loaded:false,
      allChecked: false,
      disabled:false,
      page:1,
      params:''
    };
  },
  computed:{
    totalNum(){
     let data = this.list.filter(item=>item.checked)
     return data.length || 0
    },
    ...mapState(['token','userInfo'])
  },
  onLoad(options) {
    console.log('options',JSON.parse(options.data))
    this.params = JSON.parse(options.data)
    this.products()
  },
  methods: {
    async addCoupon(params) {
      this.disabled = true
      var _this = this;
      uni.showLoading({
        title:'正在提交...'
      })
      const resData = await addCoupon(params)
      if(resData.code === 1){
        uni.hideLoading()
        this.$api.msg(resData.msg)
        setTimeout(()=>{
          // uni.navigateTo({
          //   url:'/pages/store_manage_comp/card_manage'
          // })
          uni.navigateBack({
            delta:2
          })
        },500)
      }
    },
    products(){
      this.$http
        .post(`/api/merchants/Products/index`, {
          token: this.token,
          type:1,
          page:this.page,
          keyword:this.keyword
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            console.log(data.data)
            uni.hideLoading()
            data.data.map(item => {
              item.checked = false;
              return item;
            });
            this.list = data.data
            console.log(this.list)
            this.loaded = true
          }
        })
    },
    _confirm(){
      let data = this.list.filter(item=>item.checked)
      let ids = []
      data.forEach((v,i)=>{
        ids.push(v.id)
      })
      if(ids.length===0){
        this.$api.msg('请选择商品')
        return
      }
      let params = Object.assign(this.params,{
        value:ids.join(',')
      })
      console.log(params)
      this.addCoupon(params)
    },
    //选中状态处理
    check(type, index) {
        this.list[index].checked = !this.list[index].checked;
    },
    inputChange(e) {
      if (timer) clearInterval(timer);
      timer = setTimeout(() => {
        this.search(e.detail.value);
      }, 800);
    },
    _delete() {
      console.log('delete');
      this.keyword = '';
    },
    search() {
      this.loading = true
      this.products()
      // this.$http
      //   .post(`/api/search/index`,{
      //     page:this.page,
      //     keywords:this.keyword,
      //     store_id:this.userInfo.store_id
      //   })
      //   .then(response => {
      //     const data = response.data;
      //     uni.hideLoading()
      //     this.loading = false
      //      const resdata = response.data;
      //      uni.hideLoading()
      //      this.loading = false
      //      if (response.code === 1) {
      //        let product_list= resdata.product_list.data
      //         product_list.map(item => {
      //          item.checked = false;
      //          return item;
      //        });
      //        this.list =product_list
      //      }
      //   });
    },
    switchTab(item) {
      this.tabId = item.id;
    }
  }
};
</script>
<style lang="scss" scoped>
page,
.container {
  height: 100%;
}
</style>
<style lang="scss" scoped>
@import 'mixin.scss';
page,
.container {
  background-color: #f7f4f8;
  height: 100%;
}
.container {
  width: 100%;
  .serach-section {
    z-index: 3;
    position: fixed;
    top: 0;
    width: 100%;
    left: 0;
    height: 100rpx;
    background: rgba(250, 250, 250, 1);
    overflow: hidden;
    .search-box {
      height: 66rpx;
      margin: 17rpx 30rpx 0;
      border-radius: 33rpx;
      background-color: #efeff1;
      @include flexX;
      @include flexA;
      .close,
      .search {
        font-size: 36rpx;
      }
      .search {
        margin: 0 20rpx;
      }
      .close {
        margin: 0 20rpx 0 40rpx;
      }
      input {
        flex: 1;
      }
    }
  }
  .order-section {
    width: 100%;
    padding-top: 100rpx;
    background-color: #fff;
    .item {
      width: 670rpx;
      @include flexX;
      margin: 20rpx auto;
      padding: 25rpx 0;
      border-bottom: 1px solid #e8e8e8;
      &:last-child {
        border-bottom: none;
      }
      .icon {
        font-size: 46rpx;
        &.cuIcon-round {
          color: #e9e9e9;
        }
        &.cuIcon-roundcheckfill {
          color: #e8583e;
        }
      }
      .cover {
        width: 158rpx;
        height: 158rpx;
        margin: 0 20rpx;
        border-radius: 6rpx;
      }
      .content {
        flex: 1;
        height: 128rpx;
        margin-right: 60rpx;
        @include flexY;
        justify-content: space-between;
        font-size: 24rpx;
        .title {
          color: #333537;
          font-size: 28rpx;
        }
        .num-inner {
          @include flexSB;
          .price {
            color: #f64443;
          }
          .stock {
            color: #999999;
          }
        }
      }
    }
  }
  .btn-section{
    width: 100%;
    border-top: 1px solid #DDDDDD;
    height: 120rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 3;
    background-color: #fff;
    .cu-btn{
      width: 90%;
      left: 5%;
      background:linear-gradient(-90deg,rgba(242,106,83,1) 0%,rgba(238,67,39,1) 100%);
      height: 90rpx;
      margin-top: 15rpx;
      border-radius:45rpx;
    }
  }
}
</style>
