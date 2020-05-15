import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const saveStateData = function(key, dat) {
  if (key == 'appLifeData') {
    return false;
  }
  uni.setStorageSync('state_' + key, dat);
}
const store = new Vuex.Store({
  state: {
    hasLogin: false,
    userInfo: {},
    userData:[],
    token:'',
    tabbar: [{
        "iconPath": "https://cdn.swh296.com/img/iconList/index_tabbar_shouye.png",
        "selectedIconPath": "https://cdn.swh296.com/img/iconList/index_tabbar_shouye_sel.png",
        "title": "首页",
        "page": "store-index"
      },
      {
        "iconPath": "https://cdn.swh296.com/img/iconList/index_tabbar_fenlei.png",
        "selectedIconPath": "https://cdn.swh296.com/img/iconList/index_tabbar_fenlei_sel.png",
        "title": "分类",
        "page": "classify"
      },
      {
        "iconPath": "https://cdn.swh296.com/img/iconList/index_tabbar_all.png",
        "selectedIconPath": "https://cdn.swh296.com/img/iconList/index_tabbar_all_sel.png",
        "title": "全部",
        "page": "all",
        "size": "big"
      },
      {
        "iconPath": "https://cdn.swh296.com/img/iconList/index_tabbar_mine.png",
        "selectedIconPath": "https://cdn.swh296.com/img/iconList/index_tabbar_mine_sel.png",
        "title": "我的",
        "page": "activity"
      }
    ],
    storeId:'', //进入店铺的id 
    tabbarTextColor: "#D7D7D7",
    tabbarTextActiveColor: "#F64443",
    // 店铺管理
    manage_tabbar: [{
        "iconPath": "https://cdn.swh296.com/img/store-manage/store-index.png",
        "selectedIconPath": "https://cdn.swh296.com/img/store-manage/store-index-sel.png",
        "title": "首页",
        "page": "manage-index"
      },
      {
        "iconPath": "https://cdn.swh296.com/img/store-manage/store-order.png",
        "selectedIconPath": "https://cdn.swh296.com/img/store-manage/store-order-sel.png",
        "title": "订单管理",
        "page": "manage-order"
      },
      // {
      //   "iconPath": "https://cdn.swh296.com/img/store-manage/store-goods.png",
      //   "selectedIconPath": "https://cdn.swh296.com/img/store-manage/store-goods-sel.png",
      //   "title": "商品管理",
      //   "page": "manage-goods",
      // },
      // {
      //   "iconPath": "https://cdn.swh296.com/img/store-manage/store-tongji.png",
      //   "selectedIconPath": "https://cdn.swh296.com/img/store-manage/store-tongji-sel.png",
      //   "title": "统计",
      //   "page": "manage-statistics"
      // }
    ],
  },
  mutations: {
    SET_COLOR(state, colors) {
      // 底部菜单文字 选中
      state.tabbarTextActiveColor = colors.tabbarTextActiveColor
      // 底部菜单文字 未选中
      state.tabbarTextColor = colors.tabbarTextColor
    },
    login(state, provider) {
      state.hasLogin = true;
      state.userInfo = provider;
      uni.setStorage({ //缓存用户登陆状态
        key: 'userInfo',
        data: provider
      })
      console.log(state.userInfo);
    },
    logout(state) {
      state.hasLogin = false;
      // state.userInfo = {};
      // uni.removeStorage({
      //   key: 'userInfo'
      // })
      state.userInfo = {}
      state.token = ''
      uni.clearStorageSync();
    },
    // add
    // login(state, userData) {
    //   state.userData.userInfo = userData || {};
    //   state.userData.hasLogin = true;
    //   //所有修改的最后一句都应该更新持久化数据
    //   saveStateData('userData', state.userData);
    // },
    setBrandInfo(state, brandInfo) {
      state.brandInfo = brandInfo || {}
      saveStateData('brandInfo', state.brandInfo);
    },
    setUserData(state, userData) {
      state.userData = userData || {}
      saveStateData('userData', state.userData);
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo || {}
      saveStateData('userInfo', state.userInfo);
    },
    setToken(state, token) {
      // console.log(state, token)
      state.token = token;
      saveStateData('token', token);
    },
    setCode(state, code) {
      // console.log(state, code)
      state.userCode = code;
      saveStateData('userCode', code);
    },
    setStoreId(state, storeId) {
      state.storeId = storeId;
      saveStateData('storeId', storeId);
    },
    logout(state) {
      state.userData.hasLogin = false;
      //所有修改的最后一句都应该更新持久化数据
      saveStateData('userData', state.userData);
    },
    //以下为固定函数，不需要改动，主要提供了持久化的状态数据（初始化和更新）统一接口。
    setStateData(state, newUserData) { //更新状态数据并保存到存储。
      if (Array.isArray(newUserData)) {
        var keyname = newUserData[0];
        var dat = newUserData[1];
      } else {
        var stateKeys = Object.keys(state);
        var keyname = stateKeys[0];
        var dat = newUserData;
      }
      // console.log(dat);
      state[keyname] = service.extend(true, state[keyname], dat);
      //所有修改的最后一句都应该更新持久化数据
      saveStateData(keyname, state[keyname]);
    },
    initStateData(state) { //从存储读取并初始化状态数据
      //在 App.vue 文件的 onLaunch 里面调用这个函数，即可在启动app 的时候初始化数据。
      // console.log('state',state)
      for (var keyname in state) {
        var stateData = uni.getStorageSync('state_' + keyname);
        // console.log('初始化状态数据：' + keyname, JSON.stringify(stateData));
        //初始化state的数据
        // console.log('keyname',keyname,stateData)
        if (keyname == 'userCode') {
          state[keyname] = stateData
        } else {
          state[keyname] = service.extend(true, state[keyname], stateData);
        }
        //所有修改的最后一句都应该更新持久化数据
        saveStateData(keyname, state[keyname]);
      }
    }
  },
  actions: {

  }
})

export default store
