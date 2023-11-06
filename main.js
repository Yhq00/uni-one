
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

//到入网络请求的包
import { $http } from '@escook/request-miniprogram'

uni.$http = $http

$http.baseUrl = 'https://api-hmugo-web.itheima.net';


// 请求开始之前做一些事情,请求拦截器
$http.beforeRequest = function (options) {
  // do somethimg...
  uni.showLoading({
  	title:'数据加载中...'
  })
}

// 请求完成之后做一些事情，响应拦截器
$http.afterRequest = function () {
  // do something...
  uni.hideLoading()
}

Vue.config.productionTip = false


//统一封装请求失败提示的方法
uni.$showMsg = function(title = '数据请求失败！',duration = 1500){
	uni.showToast({
		title,
		duration,
		icon:'none'
	})
}

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif