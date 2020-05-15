<template>
  <view>
    <view class="draw_modal" @click="_hideSModal">
    </view>
    <view class="s-modal" :class="modalCls">
      <slot></slot>
      <text class="cuIcon-roundclose cu-icon" @click="_hideSModal"  v-if="isIconClose"></text>
    </view>
  </view>
</template>

<script>
  export default{
    data(){
      return{
        
      }
    },
    props: ['modalCls','isIconClose'],
    methods:{
      _hideSModal(){
        this.$emit('_hideSModal')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .s-modal{
    position: fixed;
    // top: 50%;
    left: 50%;
    transform: translate(-50%);
    .cu-icon {
      font-size: 60rpx;
      position: absolute;
      bottom: -22%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9;
      color: #fff;
    }
  }
</style>
