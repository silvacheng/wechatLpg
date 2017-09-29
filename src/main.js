// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import router from './router'
import App from './App'
import { AjaxPlugin, md5, WechatPlugin } from 'vux'
// 时间戳
const timeStamp = Date.parse(new Date())
// mas加密
const md5String = 'aaahg10001:6197fecc-e403-4627-9f4e-0d2a72708c33:' + timeStamp
Vue.use(AjaxPlugin)
Vue.use(WechatPlugin)
Vue.use(VueRouter)

FastClick.attach(document.body)

Vue.config.productionTip = false
// 配置请求头 appcan平台
Vue.http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
Vue.http.defaults.headers.post['datatype'] = 'json'
Vue.http.defaults.headers.post['x-mas-app-info'] = 'aaahg10001/public'
Vue.http.defaults.headers.post['appverify'] = 'md5=' + md5(md5String) + ';ts=' + timeStamp
/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
