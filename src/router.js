import Vue from 'vue'
import Router from 'vue-router'

// import {mapGetters} from 'vuex';
// import store from '@/store';

const xiaozhangpage = (resolve) => {
  import('./pages/xiaozhang-page.vue').then((module) => {
    resolve(module);
  })
}
const jiazhangpage = (resolve) => {
  import('./pages/jiazhang-page.vue').then((module) => {
    resolve(module);
  })
}
Vue.use(Router)

let routes = [{
    path: '/',
    redirect: '/xiaozhang-page',
    meta: {}
  },
  //校长页面
  {
    path: '/xiaozhang-page',
    name: 'xiaozhang-page',
    component: xiaozhangpage,
    meta: {
      title: '校长page',
      keepAlive: false,
    }
  },
  //家长页面
  {
    path: '/jiazhang-page',
    name: 'jiazhang-page',
    component: jiazhangpage,
    meta: {
      title: '家长page',
      keepAlive: false,
    }
  }
]

// 给routes中成员加上index
let index_value = 0;
routes.forEach((c, i) => {
  c.meta.index = index_value++;
})

let router = new Router({
  mode: 'history',
  // base: 'src',
  routes
})


router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  // store.dispatch('updateIsloading', true);
  // http://dev0828.h5.haotuoguan.cn/confirm-keye?state=1&tel=18159800156&open_id=oS__X1cVpSelfHNduHGzE7DyHHYc&student_id=64&homework_id=1&round_id=&punchcard_date=
  // ?state=0&open_id=oS__X1cVpSelfHNduHGzE7DyHHYc00
  // 取参数
  // 保存地址中携带的所有参数
  sessionStorage.setItem('query', JSON.stringify(to.query));
  Object.keys(to.query).forEach((c, i) => {
    sessionStorage.setItem(c, to.query[c]);
  })

  if (from.name === 'children' && to.name === 'login') {
    // 如果没有退出登录的情况下进入login，则跳children页
    if (sessionStorage.getItem("quitstatus") === 'false') {
      next(false);
      return;
    }
  }

  if (from.name === 'login' && to.name === 'children') {
    // 如果退出登录后要进children
    if (sessionStorage.getItem("quitstatus") === 'true') {
      // 已经退出登录，就跳登录页
      next(false)
      return;
    }
  }

  if (to.query.state == 0) {
    // 登录页
    next('./login');
    return;
  }

  next();
})

router.afterEach((to, from) => {
  document.title = to.meta.title;
})

export default router;
