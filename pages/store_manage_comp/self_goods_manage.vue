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
    <view class="bt-section">
      <view class="bt-l" @click="check('all')">
        <text class="icon" :class="[allChecked ? 'cuIcon-roundcheckfill' : 'cuIcon-round']"></text>
        <text>全选 ({{totalNum}})</text>
      </view>
      <!-- 下架   售卖中和推荐商品中显示  出现弹窗 -->
      <!-- 上架  下架和全部页面显示 弹窗-->
      <!-- 推荐  售卖中 弹窗 -->
      <!-- 取消推荐  推荐页面(特殊)  -->
      <!-- 删除  下架页面 -->
      <!--tabId 1 售卖中 2 已下架 3 推荐商品  4 全部  -->
      <view class="bt-r" v-if="tabId == 1">
        <button class="cu-btn round bg-grey" :disabled="disabled" data-name="下架" data-id="2" @click="handleGoods">下架</button>
        <button class="cu-btn round bg-red"  :disabled="disabled" data-name="推荐" data-id="3" @click="handleGoods">推荐</button>
      </view>
      <view class="bt-r" v-if="tabId == 2">
        <button class="cu-btn round bg-ble"  :disabled="disabled" data-name="上架" data-id="1" @click="handleGoods">上架</button>
        <button class="cu-btn round bg-red"  :disabled="disabled" data-name="删除" data-id="5" @click="handleGoods">删除</button>
      </view>
      <view class="bt-r" v-if="tabId == 3">
        <button class="cu-btn round bg-grey"  :disabled="disabled" data-name="下架" data-id="2" @click="handleGoods">下架</button>
        <button class="cu-btn round bg-red"  :disabled="disabled" data-name="取消推荐" data-id="4" @click="handleGoods">取消推荐</button>
      </view>
      <view class="bt-r" v-if="tabId == 4">
        <button class="cu-btn round bg-grey"  :disabled="disabled" data-name="上架" data-id="1" @click="handleGoods">上架</button>
      </view>
    </view>
    <empty setSrc="https://cdn.swh296.com/img/common/empty_content.png" v-if="loaded === true && list.length === 0">
      <view class="empty-text">
        暂无商品
      </view>
    </empty>
    <rf-loading v-if="loading"></rf-loading>
    <tui-modal :show="isrecModal" @click="chooseRec"  @cancel="hiderecModal" content="请选择推荐类型" :button="recList"></tui-modal>
  </view>
</template>

<script>
import {mapState} from 'vuex'
import empty from '@/components/empty';
import tuiButton from '@/components/ThorUI/button/button';
import tuiModal from '@/components/ThorUI/modal/modal';
let timer = null;
export default {
  components:{
    empty,
    tuiButton,
    tuiModal
  },
  data() {
    return {
      recList: [{
      	text: "新品抢先",
      	type: 'green',
      	plain: true
      }, {
      	text: "品牌特卖",
      	plain: true
      }, {
      	text: "精品热销",
      	type: 'red',
      	plain: true
      }],
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
        },
      ],
      tabId: 1,
      keyword: '',
      list: [],
      page:1,
      allChecked: false,
      loaded:false,
      loading:false,
      ids:'',
      operate:'',//1=上架,2=下架,3=推荐,4=取消推荐
      disabled:false,
      isrecModal: false,
      rec_id:0
    };
  },
  computed:{
    totalNum(){
     let data = this.list.filter(item=>item.checked)
     return data.length || 0
    },
    ...mapState(['token','userInfo'])
  },
  onLoad() {
    this.products()
  },
  methods: {
    chooseRec(e) {
    	let index = e.index;
      let objData = {}
      switch(index){
        case 0:
          objData.store_new=1
          break;
        case 1:
          objData.store_hot=1
          break;  
        case 2:
          objData.store_rec=1
          break;   
      }
      this.isrecModal= false
      let params = Object.assign({token: this.token,ids:this.ids},objData)
      this.update(params)
    },
    hiderecModal() {
      this.isrecModal = false;
    },
    handleGoods(e){
      let dataset = e.target.dataset
        //1=上架,2=下架,3=推荐,4=取消推荐
      let content = dataset.name
      this.getIds(content)
      if(content !=='推荐' && this.ids){
        uni.showModal({
            content: '确定要'+ content +'该商品么?',
            success: (e)=>{
            	if(e.confirm){
              this.disabled = true
              let objData = {}
              switch(content){
                case '上架':
                  objData.on_sale=1
                  break;
                case '下架':
                  objData.on_sale=0
                  break;  
                case '删除':
                  objData.is_del=1
                  break;   
                case '取消推荐':
                  objData.store_rec=0
                  objData.store_hot=0
                  objData.store_new=0
                  break;    
              }
              let params = Object.assign({token: this.token,ids:this.ids},objData)
              this.update(params)
            	}
            }
        });
      }
    },
    update(params){
      console.log(params)
       this.$http
         .post(`/api/merchants/Products/update`, params)
         .then(response => {
           const data = response.data;
           if (response.code ==1) {
             this.disabled = false
             this.$api.msg(response.msg)
             //售卖中推荐  全部商品中上架
             this.list = this.list.filter(item => item.id !==4);
             console.log(params.on_sale ==1 && this.tabId !=4)
             // if(params.store_new !=1 && (params.on_sale ==1 && this.tabId !=4)){
             //   this.list = this.list.filter(item => !item.checked);
             // }
             let isChecked = params.store_new == 1 || (params.on_sale ==1 && this.tabId ==4)
             if(!isChecked){
               this.list = this.list.filter(item => !item.checked);
             }
           }else{
             this.disabled = false
           }
         })
     },
    // 添加优惠券
    addCoupon(){
      this.$http
        .post(`/api/merchants/coupon/add`, {
          token: this.token,
          type:this.tabId,
          page:this.page
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            uni.hideLoading()
            data.data.map(item => {
              
              item.checked = false;
              return item;
            });
            this.list = data.data
            this.loaded = true
            this.loading = false
          }
        })
    },
    products(){
      this.$http
        .post(`/api/merchants/Products/index`, {
          token: this.token,
          type:this.tabId,
          page:this.page,
          keyword:this.keyword
        })
        .then(response => {
          const data = response.data;
          if (response.code === 1) {
            setTimeout(()=>{
              uni.hideLoading()
            },300)
            data.data.map(item => {
              item.checked = false;
              return item;
            });
            this.list = data.data
            this.loaded = true
            this.loading = false
          }
        })
    },
    getIds(name){
      let data = this.list.filter(item=>item.checked)
      let ids = []
      data.forEach((v,i)=>{
        ids.push(v.id)
      })
      this.ids = ids.join(',')
      if(!this.ids){
        this.$api.msg('请选择商品')
        return
      }else{
        if(name === '推荐') this.isrecModal = true
      }
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
      // this.calcTotal(type);
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
      this.keyword = '';
    },
    search() {
      this.loading = true
      this.products()
    },
    switchTab(item) {
      this.tabId = item.id;
      uni.showLoading({
        title:'加载中...'
      })
      this.page = 1
      this.list = []
      this.loaded = false
      this.products()
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
.tui-modal-custom{
  .tui-prompt-title{
    font-size: 30rpx;
    color: #333;
    text-align: center;
    line-height: 50rpx;
  }
  .tui-btn{
    width: 50%;
  }
  .rec-list{
    width: 100%;
    @include flexSB;
    margin: 20rpx auto;
    .cu-btn{
      font-size: 24rpx;
      padding: 0 20rpx;

      &.active{
        background:rgba(241,95,71,1);
        color: #fff;
      }
    }
  }
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
    bottom: 0;
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
        &.bg-ble{
          background:rgba(19,132,255,1);
          color: #fff;
        }
      }
    }
  }
}
</style>
