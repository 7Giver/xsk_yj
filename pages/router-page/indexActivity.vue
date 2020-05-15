<template>
	<view class="container">
    <!-- 空白页 -->
    <empty setSrc="https://cdn.swh296.com/img/common/empty_content.png">
      <view class="empty-text">
        暂无相关活动
      </view>
    </empty>
	</view>
</template>

<script>
  import empty from "@/components/empty";
	export default {
    components:{
      empty
    },
		data() {
			return {
				
			};
		},
		methods:{
		}
	}
</script>

<style lang="less">

</style>
