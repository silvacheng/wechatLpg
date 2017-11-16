// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import router from './router'
import store from './store'
import App from './App'
import _ from 'lodash'
import $ from 'jquery'
import { AjaxPlugin } from 'vux'

Vue.use(AjaxPlugin, VueRouter, _, $)
Object.defineProperty(Vue.prototype, '$', {value: $})
Object.defineProperty(Vue.prototype, '_', {value: _})
// console.log(window.navigator.userAgent)
// router.beforeEach((to, from, next) => {
//   if (cookie.get('openId')) {
//     if (to.path === '/') {
//       next({path: '/lpgShop'})
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
// })
FastClick.attach(document.body)
Vue.config.productionTip = false
// 配置请求头
Vue.http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
