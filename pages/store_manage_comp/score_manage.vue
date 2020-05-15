<template>
  <view class="container">
    <view class="serach-section">
      <view class="search-box">
        <text class="cuIcon-search search"></text>
        <input type="text" v-model="keyword" placeholder="搜索" @input="inputChange" value="" />
        <text class="cuIcon-roundclose close" v-if="keyword.trim()" @click="_delete"></text>
      </view>
    </view>
    <view class="tab-section">
      <view class="tab">
        <view class="tab-item" v-for="(item, index) in tabList" @click="switchTab(item)" :class="{ active: item.id == tabId }" :key="index">{{ item.text }}</view>
      </view>
    </view>
    <view class="splitCls fix"></view>
    <view class="order-section">
      <view class="item" v-for="(item, index) in list" :key="index">
        <text class="icon" :class="[item.checked ? 'cuIcon-roundcheckfill' : 'cuIcon-round']" @click="check('item', index)"></text>
        <image src="https://cdn.swh296.com/img/common/missing-face.png" class="cover" mode=""></image>
        <view class="content">
          <view class="title-inner">
            <text class="title">多功能粉色美人鱼</text>
            <button class="btn" v-if="item.btn_text" :class="[item.btn_text === '发布' ? 'release' : 'out']" @click="_handleBtn(item.btn_text)">{{ item.btn_text }}</button>
          </view>
          <view class="num-inner">
            <text class="price">¥265</text>
            <text class="stock">库存: 52000</text>
          </view>
        </view>
      </view>
    </view>
    <view class="splitCls bt"></view>
    <view class="btn-section"><button class="cu-btn round" @click="_toAddScore">+新增积分商品</button></view>
  </view>
</template>

<script>
let timer = null;
export default {
  data() {
    return {
      tabList: [
        {
          text: '全部',
          id: 1
        },
        {
          text: '待发布',
          id: 2
        },
        {
          text: '兑换中',
          id: 3
        }
      ],
      tabId: 1,
      keyword: '',
      list: [{}, {}],
      cartList: [
        {
          id: 4,
          image: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2668268226,1765897385&fm=26&gp=0.jpg',
          attr_val: 'XL',
          stock: 55,
          title: '朵绒菲小西装',
          price: 175.88,
          number: 1
        },
        {
          id: 5,
          image:
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552410549432&di=06dd3758053fb6d6362516f30a42d055&imgtype=0&src=http%3A%2F%2Fimgcache.mysodao.com%2Fimg3%2FM0A%2F67%2F42%2FCgAPD1vNSsHNm-TnAAEy61txQb4543_400x400x2.JPG',
          attr_val: '520 #粉红色',
          stock: 15,
          title: '迪奥（Dior）烈艳唇膏',
          price: 1089.0,
          number: 1
        }
      ],
      allChecked: false
    };
  },
  computed: {
    totalNum() {
      let data = this.list.filter(item => item.checked);
      return data.length || 0;
    }
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    _toAddScore(){
      uni.navigateTo({
        url:'/pages/store_manage_comp/new_score'
      })
    },
    // 发布
    _handleBtn(text){
      let data =  '您确定要'+text+'该商品么？'
      uni.showModal({
        content: data,
        success: e => {
          if (e.confirm) {
          }
        }
      })
    },
    //请求数据
    async loadData() {
      let list = await this.$api.json('cartList');
      // let list = this.cartList
      list.map(item => {
        item.checked = false;
        return item;
      });
      this.list = list;
      console.log(this.list);
      this.calcTotal(); //计算总价
    },
    //选中状态处理
    check(type, index) {
      if (type === 'item') {
        this.list[index].checked = !this.list[index].checked;
      } else {
        const checked = !this.allChecked;
        const list = this.list;
        list.forEach(item => {
          item.checked = checked;
        });
        this.allChecked = checked;
      }
      this.calcTotal(type);
    },
    //计算总价
    calcTotal() {
      let list = this.list;
      if (list.length === 0) {
        this.empty = true;
        return;
      }
      // let total = 0;
      let checked = true;
      list.forEach(item => {
        if (item.checked === true) {
          // total += item.price * item.number;
        } else if (checked === true) {
          checked = false;
        }
      });
      this.allChecked = checked;
      // this.total = Number(total.toFixed(2));
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
      // this.loading = true
      // this.$http
      //   .post(`/api/search/index`,{
      //     page:this.page,
      //     limit:this.limit,
      //     keywords:this.defaultKeyword
      //   })
      //   .then(response => {
      //     const data = response.data;
      //     uni.hideLoading()
      //     this.loading = false
      //     if (response.code === 1) {
      //       this.loaded = true
      //       this.searchStore = data
      //      console.log('data',data)
      //     }
      //   });
    },
    switchTab(item) {
      this.tabId = item.id;
    }
  }
};
</script>
<style lang="scss">
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
    top: 0rpx;
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
  .tab-section {
    position: fixed;
    top: 100rpx;
    left: 0;
    width: 100%;
    background-color: #fff;
    height: 100rpx;
    z-index: 3;
    .tab {
      position: absolute;
      top: 0;
      left: 8%;
      width: 84%;
      background-color: #fff;
      height: 100rpx;
      @include flexX;
      z-index: 3;
      .tab-item {
        flex: 1;
        height: 100rpx;
        line-height: 100rpx;
        text-align: center;
        position: relative;
        &.active {
          @include active;
        }
      }
    }
  }
  .splitCls.fix {
    position: fixed;
    top: 200rpx;
    left: 0;
    z-index: 3;
  }
  .splitCls.bt {
    height: 140rpx;
  }
  .order-section {
    width: 100%;
    padding-top: 220rpx;
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
        overflow: hidden;
        flex: 1;
        height: 128rpx;
        // margin-right: 60rpx;
        @include flexY;
        justify-content: space-between;
        font-size: 24rpx;
        .title-inner {
          @include flexSB;
          .title {
            flex: 1;
            color: #333537;
            font-size: 28rpx;
            margin-right: 20rpx;
            @include txt_cut();
          }
          .btn {
            width: 114rpx;
            height: 54rpx;
            line-height: 54rpx;
            border-radius: 27rpx;
            color: #fff;
            font-size: 24rpx;
            &.release {
              background: rgba(241, 95, 71, 1);
            }
            &.out {
              background: rgba(254, 134, 25, 1);
            }
          }
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
}
</style>
