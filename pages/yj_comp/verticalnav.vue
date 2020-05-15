<template>
  <view>
    <!-- 		<swiper class="screen-swiper round-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000"
		 duration="500">
			<swiper-item v-for="(item,index) in 4" :key="index">
				<image :src="'https://ossweb-img.qq.com/images/lol/web201310/skin/big3900'+index+ '.jpg'" mode="aspectFill"></image>
			</swiper-item>
		</swiper> -->
    <view class="VerticalBox">
      <!-- <scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="verticalNavTop" style="height:calc(100vh - 0upx)">
				<view class="cu-item" :class="index==tabCur?'text-green cur':''" v-for="(item,index) in list" :key="index" @tap="TabSelect"
				 :data-id="index">
					Tab-{{item.name}}
				</view>
			</scroll-view> -->
      <scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="verticalNavTop" style="height:calc(100vh - 0upx)">
        <view class="cu-item" :class="index == tabCur ? 'text-green cur' : ''" v-for="(item, index) in flist" :key="index" @tap="TabSelect" :data-id="index">{{ item.name }}</view>
      </scroll-view>
      <scroll-view class="VerticalMain" scroll-y scroll-with-animation style="height:calc(100vh - 0upx)" :scroll-into-view="'main-' + mainCur" @scroll="VerticalMain">
        <!-- 	<view class="padding-top padding-lr" v-for="(item,index) in list" :key="index" :id="'main-'+index">
					<view class="cu-list menu-avatar">
						<view class="cu-item ">
							<view class="cu-avatar radius lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/img/champion/Morgana.png);"></view>
							<view class="content">
								<view class="text-pink"><text class="text-cut">莫甘娜</text></view>
								<view class="text-gray text-sm flex"> <text class="text-cut">凯尔，你被自己的光芒变的盲目！</text></view>
							</view>
							<view class="action">
								<view class="text-grey text-xs">22:20</view>
								<view class="cu-tag round bg-red sm">5</view>
							</view>
						</view>
					</view>
				</view> -->
        <view v-for="(item, index) in slist"  class="s-list" :key="index" :id="'main-' + index">
          <text class="s-item">{{ item.name }}</text>
          <view class="t-list">
            <view v-if="titem.pid === item.id" class="t-item" v-for="titem in tlist" :key="titem.id">
              <image :src="titem.picture"></image>
              <text>{{ titem.name }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      tabCur: 0,
      mainCur: 0,
      verticalNavTop: 0,
      load: true,
      flist: [],
      slist: [],
      tlist: []
    };
  },
  onLoad() {
    uni.showLoading({
      title: '加载中...',
      mask: true
    });
    let list = [{}];
    for (let i = 0; i < 3; i++) {
      list[i] = {};
      list[i].name = String.fromCharCode(65 + i);
      list[i].id = i;
    }
    this.loadData();
    this.list = list;
    this.listCur = list[0];
  },
  onReady() {
    uni.hideLoading();
  },
  methods: {
    async loadData() {
      let list = await this.$api.json('cateList');
      list.forEach(item => {
        if (!item.pid) {
          this.flist.push(item); //pid为父级id, 没有pid或者pid=0是一级分类
        } else if (!item.picture) {
          this.slist.push(item); //没有图的是2级分类
        } else {
          this.tlist.push(item); //3级分类
        }
      });
    },
    TabSelect(e) {
      this.tabCur = e.currentTarget.dataset.id;
      this.mainCur = e.currentTarget.dataset.id;
      console.log(this.tabCur,this.mainCur)
      // this.verticalNavTop = (e.currentTarget.dataset.id - 1) * 50;
      let index = this.slist.findIndex(sitem=>sitem.pid === this.tabCur);
      this.verticalNavTop = this.slist[index].top;
    },
    VerticalMain(e) {
      // #ifdef MP-ALIPAY
      return false; //支付宝小程序暂时不支持双向联动
      // #endif
      let that = this;
      let tabHeight = 0;
      if (this.load) {
        for (let i = 0; i < this.slist.length; i++) {
          let view = uni.createSelectorQuery().select('#main-' + this.slist[i].id);
          view
            .fields(
              {
                size: true
              },
              data => {
                this.slist[i].top = tabHeight;
                tabHeight = tabHeight + data.height;
                this.slist[i].bottom = tabHeight;
              }
            )
            .exec();
        }
        this.load = false;
      }
      let scrollTop = e.detail.scrollTop + 10;
      for (let i = 0; i < this.slist.length; i++) {
        if (scrollTop > this.slist[i].top && scrollTop < this.slist[i].bottom) {
          this.verticalNavTop = (this.slist[i].id - 1) * 50;
          this.tabCur = this.slist[i].id;
          console.log(scrollTop);
          return false;
        }
      }
    }
  }
};
</script>

<style lang="scss">
.s-item {
  display: flex;
  align-items: center;
  height: 70rpx;
  padding-top: 8rpx;
  font-size: 28rpx;
  color: $font-color-dark;
}
.t-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  background: #fff;
  padding-top: 12rpx;
  &:after {
    content: '';
    flex: 99;
    height: 0;
  }
}
.t-item {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 176rpx;
  font-size: 26rpx;
  color: #666;
  padding-bottom: 20rpx;

  image {
    width: 140rpx;
    height: 140rpx;
  }
}

.fixed {
  position: fixed;
  z-index: 99;
}

.VerticalNav.nav {
  width: 200upx;
  white-space: initial;
}

.VerticalNav.nav .cu-item {
  width: 100%;
  text-align: center;
  background-color: #fff;
  margin: 0;
  border: none;
  height: 50px;
  position: relative;
}

.VerticalNav.nav .cu-item.cur {
  background-color: #f1f1f1;
}

.VerticalNav.nav .cu-item.cur::after {
  content: '';
  width: 8upx;
  height: 30upx;
  border-radius: 10upx 0 0 10upx;
  position: absolute;
  background-color: currentColor;
  top: 0;
  right: 0upx;
  bottom: 0;
  margin: auto;
}

.VerticalBox {
  display: flex;
}

.VerticalMain {
  background-color: #f1f1f1;
  flex: 1;
}
</style>
