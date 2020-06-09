import Vue from 'vue'
import store from './store'
import App from './App'
import service from './service'
import Json from './Json'
const baseURL = 'https://apis.53pzck.top'
import * as Common from './common/api.js'
import parseHtml from '@/common/parseHtml.js'
import {profile} from 'common/js/commonInfo.js'
import uni_request from 'js_sdk/songGQ-req/uni_request/uni_request.js'
const http = uni_request({
    // baseURL: 'https://apis.53pzck.top', 
    baseURL: 'https://apis.53pzck.top', 
    header:{
      'content-type':'application/x-www-form-urlencoded',
    },
    timeout: 60000,
    // #ifdef H5
    withCredentials: true
    // #endif
})
http.interceptors.request.use(async (config, ...args) => {
  // #ifdef H5
    if(location.href.indexOf('token')>=0){
      let interToken = Common.getQueryString('token')
      uni.setStorageSync('state_token', interToken)
    }
    // #endif
    let token = store.state.token || uni.getStorageSync('state_token')
    // config.header.Authorization = 'token' + token // 修改请求头
    config.header= { // 修改请求头
      'token':token,
      'content-type':'application/x-www-form-urlencoded'
    } 
    return config
})  
let isLogin = false 
http.interceptors.response.use(async(response, ...args) => { 
  // console.log('--response--',response)
    const { data: res } = response// args[0] method args[1] url args[3] data
    // console.log('http.interceptors',response)
    // #ifdef H5
    if(response.statusCode==401 || response.data.code == 401){
      let uniToken =store.state.token ||  uni.getStorageSync('state_token')
      if(!uniToken){
        if(location.href.indexOf('token')>=0){
          let token = Common.getQueryString('token')
          uni.setStorageSync('state_token', token)
          // await profile(token)
        }else{
         Common.authH5()
        }
      }else{
        store.commit('setToken','')
        Common.authH5()
      }
    }else{
      let token = Common.getQueryString('token')
      if(token && !isLogin){
       isLogin = true
       await profile(token)
      }
    }
    // #endif
    return response
})
// #ifdef H5
import jwx from './common/js/jwx.js'
Vue.prototype.$jwx = jwx
// #endif
import openAlert from '@/components/open-alert/open-alert'
Vue.component('openAlert', openAlert)
import rfLoading from '@/components/rf-loading/rf-loading';
/*注册全局自定义组件*/
import cuCustom from '@/colorui/components/cu-custom.vue';
import cuPageStoreIndex from "@/pages/router-page/store-index.vue";
import cuPageClassify from "@/pages/router-page/indexClassify.vue";
import cuPageAll from "@/pages/router-page/indexAll.vue";
import cuPageActivity from "@/pages/router-page/indexActivity.vue";
Vue.component('cu-custom',cuCustom)
Vue.component('cu-page-store-index',cuPageStoreIndex)
Vue.component('cu-page-classify',cuPageClassify)
Vue.component('cu-page-all',cuPageAll)
Vue.component('cu-page-activity',cuPageActivity)
// 店铺管理
import cuPageManageIndex from "@/pages/store_manage/store_manage.vue";
import cuPageManageOrder from "@/pages/store_manage_comp/order.vue";
// import cuPageManageGoods from "@/pages/store_manage_comp/goods.vue";
import cuPageManageStatistics from "@/pages/store_manage_comp/statistics.vue";
Vue.component('cu-page-manage-index',cuPageManageIndex)
Vue.component('cu-page-manage-order',cuPageManageOrder)
// Vue.component('cu-page-manage-goods',cuPageManageGoods)
Vue.component('cu-page-manage-statistics',cuPageManageStatistics)
// 预约服务模块
import cuPageAppointIndex from "@/pages/appoint/index.vue"
import cuPageAppointOrder from "@/pages/appoint/order.vue"
import cuPageAppointSelf from "@/pages/appoint/self.vue"
Vue.component('cu-page-appoint-index',cuPageAppointIndex)
Vue.component('cu-page-appoint-order',cuPageAppointOrder)
Vue.component('cu-page-appoint-self',cuPageAppointSelf)
Vue.prototype.$parseHtml = parseHtml
Vue.prototype.$service = service
Vue.prototype.$store = store
Vue.prototype.$http = http
Vue.prototype.$common = Common;
Vue.prototype.$host = 'http://localhost'
const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
const json = type=>{
	//模拟异步请求数据
	return new Promise(resolve=>{
		setTimeout(()=>{
			resolve(Json[type]);
		}, 500)
	})
}

const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}
// #ifdef MP-WEIXIN
const updateManager = uni.getUpdateManager()
updateManager.onCheckForUpdate(function (res) {
  // console.log(res.hasUpdate)
})
updateManager.onUpdateReady(function (res) {
  uni.showModal({
    title: '更新提示',
    content: '新版本已经准备好，是否重启应用？',
    success(res) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
      }
    }
  })
})
updateManager.onUpdateFailed(function (res) {
  uni.showToast({
    title:"更新失败"
  })
})
// #endif
Vue.config.productionTip = false
Vue.component('rfLoading', rfLoading);
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$baseURL = baseURL;
Vue.prototype.$api = {msg, json, prePage};

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()