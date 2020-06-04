<template>
  <view class="container">
    <view class="type-section" v-if="update">
      <view class="item" v-for="(item,index) in list" :key="index" :class="{active:item.checked}" @click="check(item, index)">
        <text>{{item.name}}</text>
        <text class="icon" :class="[item.checked ? 'cuIcon-roundcheckfill' : 'cuIcon-round']" ></text>
      </view>
    </view>
    <view class="btn-section">
      <button class="cu-btn round bg-red lg" @click="_confirm">确定</button>
    </view>
  </view>
</template>

<script>
  import {addCoupon} from '../../common/js/commonInfo.js';
  import {mapState} from 'vuex';
  export default{
    data(){
      return {
        list:[
        ],
        update:true
      }
    },
    computed: {
    },
    onLoad(options) {
      this.category()
    },
    methods:{
      check(item, index){
        console.log(item)
        console.log(this.list)
        this.list.forEach(v=>{
          if(item.id == v.id){
            item.checked = !item.checked
          }else{
            v.checked = false
          }
        })
        this.update = false
        this.update = true
      },
      category(){
        this.$http
          .post(`/api/merchants/category/index`)
          .then(response => {
            const data = response.data;
            if (response.code === 1) {
              this.list = data
              let list = this.list.map((v,i)=>{
                return v.category
              })
              list.forEach((v)=>{
                v.checked = false
              })
              this.list =list
              console.log(this.list)
            }
          })
      },
      _confirm(){
        let data = this.list.filter(item=>item.checked)
        console.log(this.list,data)
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
        this.addCoupon(params)
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import 'mixin.scss';
  page,.container{
    height: 100%;
    background-color: #fff;
  }
  .type-section{
    width: 100%;
    padding-top: 30rpx;
    .item{
      width:660rpx;
      padding: 0 25rpx ;
      @include flexSB;
      margin:0 auto 30rpx;
      height:120rpx;
      background:rgba(247,247,247,1);
      border-radius:14rpx;
      &.active{
        border:2rpx solid rgba(234, 84, 62, 1);
        box-shadow:0px 4rpx 10rpx 0px rgba(234,84,62,0.23);
        box-sizing: border-box;
      }
      text{
        color: #333537;
        font-size: 34rpx;
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
</style>
