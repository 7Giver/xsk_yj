<template>
  <view class="container">
    <view class="type-section">
      <view class="item" v-for="(item, index) in typeList" @click="_gType(item)" :key="index"><image :src="item.image" mode=""></image></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      typeList: []
    };
  },
  onLoad() {
    this.xshop();
  },
  methods: {
    xshop() {
      this.$http.post(`/addons/xshop/category/index`).then(response => {
        const data = response.data;
        if (response.code === 1) {
          console.log('data', data);
          this.typeList = data;
        }
      });
    },
    _gType(item) {
      uni.navigateTo({
        url: `/pages/category/category_product?id=${item.id}`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
page,
.container {
  .type-section {
    width: 100%;
    padding-top: 22rpx;
    .item {
      width: 690rpx;
      height: 220rpx;
      margin: 0 auto 22rpx;
      image {
        width: 690rpx;
        height: 220rpx;
      }
    }
  }
}
</style>
