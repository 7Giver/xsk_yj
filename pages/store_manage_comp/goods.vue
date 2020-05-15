<template>
  <view class="container">
    <view class="tab-section">
      <view class="tab">
        <view class="tab-item" v-for="(item, index) in tabList" @click="switchTab(item)" :class="{ active: item.id == tabId }" :key="index">{{ item.text }}</view>
      </view>
    </view>
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
     <!--   <view
        	class="yticon icon-xuanzhong2 checkbox"
        	:class="{checked: item.checked}"
        	@click="check('item', index)"
        ></view> -->
        <image src="https://cdn.swh296.com/img/common/missing-face.png" class="cover" mode=""></image>
        <view class="content">
          <text class="title">多功能粉色美人鱼</text>
          <view class="num-inner">
            <text class="price">¥265</text>
            <text class="stock">库存: 52000</text>
          </view>
        </view>
      </view>
    </view>
    <view class="splitCls" style="height: 70px"></view>
    <view class="bt-section">
      <view class="bt-l" @click="check('all')">
        <text class="icon" :class="[allChecked ? 'cuIcon-roundcheckfill' : 'cuIcon-round']"></text>
        <text>全选 ({{totalNum}})</text>
      </view>
      <view class="bt-r">
        <button class="cu-btn round bg-grey" @click="downGoods">下架</button>
        <button class="cu-btn round bg-red" @click="recommend">推荐</button>
      </view>
    </view>
  </view>
</template>

<script>
let timer = null;
export default {
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
      list: [{}, {}],
      cartList:[
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
        	image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552410549432&di=06dd3758053fb6d6362516f30a42d055&imgtype=0&src=http%3A%2F%2Fimgcache.mysodao.com%2Fimg3%2FM0A%2F67%2F42%2FCgAPD1vNSsHNm-TnAAEy61txQb4543_400x400x2.JPG',
        	attr_val: '520 #粉红色',
        	stock: 15,
        	title: '迪奥（Dior）烈艳唇膏',
        	price: 1089.00,
        	number: 1
        }
      ],
      allChecked: false
    };
  },
  computed:{
    totalNum(){
     let data = this.list.filter(item=>item.checked)
     return data.length || 0
    }
  },
  onLoad() {
    this.loadData();
  },
  mounted() {
    this.loadData();
  },
  methods: {
    downGoods(){
      let data = this.list.filter(item=>item.checked)
      console.log(this.list,data)
      let ids = []
      data.forEach((v,i)=>{
        ids.push(v.id)
      })
      console.log(ids)
    },
    recommend(){
      
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
  .tab-section{
   position: fixed;
   top: 0;
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
  .serach-section {
    z-index: 3;
    position: fixed;
    top: 100rpx;
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
    padding-top: 200rpx;
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
  .bt-section {
    width: 100%;
    height: 120rpx;
    border-top: 1px solid #dddddd;
    background-color: #fff;
    position: fixed;
    bottom: 100rpx;
    left: 0;
    @include flexSB;
    .bt-l {
      @include flexX;
      font-size: 30rpx;
      color: #666;
      margin-left: 40rpx;
      .icon {
        font-size: 40rpx;
        margin-right: 15rpx;
        &.cuIcon-round {
          color: #e9e9e9;
        }
        &.cuIcon-roundcheckfill {
          color: #e8583e;
        }
      }
    }
    .bt-r {
      @include flexSB;
      // margin-right: 25rpx;
      button {
        width: 180rpx;
        height: 70rpx;
        border-radius: 35rpx;
        margin-right: 20rpx;
      }
    }
  }
}
</style>
