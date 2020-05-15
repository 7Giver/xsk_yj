// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';
const INIT_DATA = 'INIT_DATA';

const baseURL='http://47.95.215.250:18008/st/getsysinfo';

const dateTime=function() {
	var now = new Date(),
		y = now.getFullYear(),
		m = now.getMonth() + 1,
		d = now.getDate();
	return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
}
const guid=function() {
	function S4() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
const getParentPage=function(num){
//返回 n 级父页面的对象，用于父子页面数据交换
	num=num||0;
	num+=2;
	var Pages=getCurrentPages();
	var pPage=Pages[Pages.length-num];
	return pPage;
}
// const 
const ajax=function(obj) {

	var url=obj.url || '';
	var method=obj.method || 'GET';
	var data=obj.data || {};
	var dataType=obj.dataType || 'json';
	var header=obj.header || {};
	var success=obj.success || {};
	var fail=obj.fail || {};
	var complete=obj.complete || {};

// 	var session_id = wx.getStorageSync('PHPSESSID'); //本地取存储的sessionID
// 	var uid = wx.getStorageSync('uiRet'); //本地取存储的sessionID
// 	if (session_id != "" && session_id != null) {
// 		var myHeader = {
// 			'content-type': 'application/x-www-form-urlencoded',
// 			'Cookie': 'PHPSESSID=' + session_id + '; uid=' + uid.id
// 		}
// 	} else {
// 		var myHeader = {
// 			'content-type': 'application/x-www-form-urlencoded'
// 		}
// 	}
	// header=Object.assign(header,myHeader);
	
	uni.request({
		url: url,
		method: method,
		data: data,
		dataType: dataType,
		header: header,
		success: res => {
// 			if (session_id == "" || session_id == null || session_id != res.data.session_id) {	//如果返回的和本地不一致，改写之
// 				wx.setStorageSync('PHPSESSID', res.data.session_id) //如果本地没有就说明第一次请求 把返回的session id 存入本地
// 			}
			// console.log(res)
			// let dat = res.data
			success(res)
			// res.StatusCode === 200 ? success(res) : fail(res)
		},
		fail: fail || function(res) { //
			console.log(res)
			uni.showModal({
				title: '错误',
				content: JSON.stringify(res),
			})
		},
		complete: complete
	});
}
/**
 * extend([deep], target, ...source)
 * @param {type} deep
 * @param {type} target
 * @param {type} ...source
 * @returns {unresolved}
 * 其实可能还可以利用 Object.assign() 函数做个递归来实现类似的功能。
 * 今天才知道原来 vue 已经有 extend 包了，悲剧，搞了我几天了，刚从 mui 里面剥离了这段函数出来
 * 不过 npm 包的方式使用有点烦，特地安装这个包看了下源码，也是从 jQuery 里面剥离的
* 但是在 uni-app 里面感觉去安装 npm 包有点重，所以如果是小项目一个包都没用的，就不为了这个功能去安装包了
* 安装方法： npm install extend
 */
const extend = function() { //from jquery2
		//辅助函数
	var class2type = {};
		var cT=['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'];
	   cT.forEach(function(v, i, a){
		class2type["[object " + v + "]"] = v.toLowerCase();
	});     
	var dataType = function(obj) {
		return obj == null ? String(obj) : class2type[{}.toString.call(obj)] || "object";
	};
		var isArray = Array.isArray ||
			function(object) {
				return object instanceof Array;
			   };
		var isObject = function(obj) {
			return dataType(obj) === "object";
		};
		var isPlainObject = function(obj) {
			return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
		};
	var isWindow = function(obj) {
		return obj != null && obj === obj.window;
	};         
		var isEmptyObject = function(o) {
			for (var p in o) {
				if (p !== undefined) {
					return false;
				}
			}
			return true;
		};
		var isFunction = function(value) {
			return dataType(value) === "function";
		};     
	 
	   //函数主体开始
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	if (typeof target === "boolean") {
		deep = target;

		target = arguments[i] || {};
		i++;
	}

	if (typeof target !== "object" && !isFunction(target)) {
		target = {};
	}

	if (i === length) {
		target = this;
		i--;
	}

	for (; i < length; i++) {
		if ((options = arguments[i]) != null) {
			for (name in options) {
				src = target[name];
				copy = options[name];

				if (target === copy) {
					continue;
				}

				if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];

					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					target[name] = extend(deep, clone, copy);

				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	return target;
}
export default {
  baseURL,
	ajax,
	extend,
	getParentPage,
	guid,
	dateTime}
