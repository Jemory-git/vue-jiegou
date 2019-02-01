// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router.js';
import VueAxios from 'vue-axios'
import axios from 'axios-es6'
// import store from './store';

import promptBox from './js/promptBox.js'
import enlargeImg from './js/enlargeImg.js';

Vue.use(VueAxios, axios)

// 注册全局指令v-focus ，自动聚焦
Vue.directive('focus', {
  inserted: function (el) {
    el.focus();
  }
})

Vue.prototype.relogin = function () {
  this.$router.push({
    name: 'login'
  })
}


// 设置axios的请求默认值
axios.defaults.baseURL = 'http://jms.api.weixin.haotuoguan.cn/v1';
// axios.defaults.baseURL = 'http://192.168.31.147/htgAPI/public/index.php/v1';
// axios.defaults.withCredentials = true
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function transformRequest(data, headers) {
  /* 解决json放在request payload中提交过去的情况*/
  if (!data) {
    return
  }
  let keys2 = Object.keys(data);
  /* 把json转成等号相连的键值对形式 */
  return encodeURI(keys2.map(name => `${name}=${data[name]}`).join('&'));
}]

axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  promptBox.loading();
  return config
});

axios.interceptors.response.use(function (response) {
  // 收到响应后
  promptBox.loaded();
  return response.data;
}, function (error) {
  return Promise.reject(error);
});

// 定义一个‘信息vue’，在页面图片src返回成功后发射事件，来通知main.js收集图片
Vue.prototype.eventHub = new Vue();
Vue.prototype.eventHub.$on('imgsrcgot', () => {
  setTimeout(() => {
    // 清空查看器中的图片，再取图片
    document.getElementById('slider-group').innerHTML = '';
    Vue.prototype.allNeededGrowImg = enlargeImg.changeImgArr(enlargeImg.getAllneededImgs());
    // console.log(Vue.prototype.allNeededGrowImg);
    // 如果要处理的图片很多的话，500ms就不够了
  }, 500);
})


// 全局数据
Vue.prototype.promptBox = promptBox;
Vue.prototype.G = {
  // openId: 'oS__X1cVpSelfHNduHGzE7DyHHYc0'
};

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // store,
  render: h => h(App)
})
