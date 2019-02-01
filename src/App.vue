<template>
  <div class="app-vue app" id="app" ref="app" @click="on_img_grow($event)">
    <transition :name="transitionName">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
    <transition :name="transitionName">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <div
      class="growing-img-wrapper"
      ref="scrollwrapper"
      :class="[{'show-growing-img-wrapper':showgrowingimgboo}, {'transition': transitionBoo}]"
      @click.stop="close_img_grow"
    >
      <imgViewer :refreshTimes="times" :turnToImgIndex="turnToImgIndex" @pagexchange="pagexchange"></imgViewer>
    </div>
  </div>
</template>

<script>
// 图片查看器
import imgViewer from "./components/common/img-viewer/img-viewer.vue";
// const wx = require('./js/wx.js')
import wx from "weixin-js-sdk";

export default {
  components: {
    imgViewer
  },
  data() {
    return {
      transitionName: "",
      showgrowingimgboo: false,
      transitionBoo: false,
      currentIndex1: "",
      times: 0,
      turnToImgIndex: ""
    };
  },
  methods: {
    on_img_grow(e) {
      // 将查看器定位到鼠标点击的位置
      this.positionImgViewWrapper(e);

      // 放大查看器
      setTimeout(() => {
        // 先添加transition过渡，在开始放大效果
        this.transitionBoo = true;
        this.fangdaViewer(e);
      }, 100);
    },
    fangdaViewer(e) {
      let target = e.target;
      if (!target.classList.contains("this-img-need-grow")) {
        // 过滤不需要放大的目标
        return;
      }
      let sliderGroup = document.getElementById("slider-group");

      // 如果点击的图片不在当前显示的图片列表中

      if (this.currentIndex1 != target.dataset.index1) {
        console.log("index1", target.dataset.index1);
        console.log("this.currentIndex1", this.currentIndex1);

        this.currentIndex1 = target.dataset.index1;
        // 清空当前列表
        sliderGroup.innerHTML = "";

        // 克隆与该img对象具有相同index1值的所有img对象
        let clonedImgArr = this.allNeededGrowImg[target.dataset.index1].map(
          c => {
            return c.cloneNode();
          }
        );
        clonedImgArr.forEach((c, i) => {
          c.setAttribute(this.data_v, ""); // 加入css作用域属性
          sliderGroup.appendChild(c);
        });

        // 通知图片查看器图片列表更新了
        this.times++;
      }

      // 滚动图片查看器到点击的图片位置
      this.$nextTick(() => {
        this.turnToImgIndex = target.dataset.index2;
        console.log("index2", target.dataset.index2);
      });

      // 翻页完成后显示图片查看器
      setTimeout(() => {
        this.showgrowingimgboo = true;
      }, 200);
    },
    pagexchange(index) {
      // 图片查看器组件发射事件，通知翻页了
      this.turnToImgIndex = "" + index;
    },
    close_img_grow() {
      this.showgrowingimgboo = false;
      setTimeout(() => {
        // 过渡动画完成后，移除transition
        this.transitionBoo = false;
      }, 300);
    },
    positionImgViewWrapper(e) {
      let el = e.target;
      let windowWidth = window.innerWidth;
      let windowHeight = window.innerHeight;
      let elWidth = el.offsetWidth;
      let elHeight = el.offsetHeight;

      // 计算位置
      let sbx = e.offsetX;
      let sby = e.offsetY;
      let cx = e.clientX;
      let cy = e.clientY;

      let left = cx - sbx + elWidth * 0.5;
      let top = cy - sby + elHeight * 0.5;

      // 计算scale比例
      let scaleX = elWidth / windowWidth;
      let scaleY = elHeight / windowHeight;

      // 设置样式
      this.$refs.scrollwrapper.style.left = left + "px";
      this.$refs.scrollwrapper.style.top = top + "px";
      this.$refs.scrollwrapper.style.transform = `translate3d(-50%, -50%, 0) scale3d(${scaleX},${scaleY},1)`;
    }
  },
  watch: {
    $route(to, from) {
      // 关闭放大图
      this.close_img_grow();
      // 页面切换后重置promptBox
      this.promptBox.reInit();
      // 重置currentIndex1的值
      this.currentIndex1 = "";
      // 页面切换加入过渡动画
      this.transitionName = "fade";

    // wx
    // wx.config({
    //   appId: "wxd2f6b8987502d827",
    //   debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //   timestamp: "1547625168", // 必填，生成签名的时间戳
    //   nonceStr: "Wm3WZYTPz0wzccnW", // 必填，生成签名的随机串
    //   signature: "14e8f54b66adcc654ae65fde621cb987f943d06e", // 必填，签名
    //   jsApiList: []
    // });
    }
  },
  mounted() {
    // 保存当前组件CSS作用域值
    this.data_v = this.$refs.app.attributes[0].name;

  }
};
</script>

<style lang="stylus" scoped>
.app-vue {
  // position: absolute;
  // left: 0;
  // top: 0;
  width: 100vw;

  // height: 100vh;
  .growing-img-wrapper {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: #000;
    overflow: hidden;
    z-index: -1;
    opacity: 0;

    .growing-img {
      width: 100%;
    }

    .center {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
  }

  .show-growing-img-wrapper {
    left: 50% !important;
    top: 50% !important;
    transform: translate3d(-50%, -50%, 0) scale3d(1, 1, 1) !important;
    opacity: 1;
    z-index: 1000;
  }

  .transition {
    transition: all 0.3s;
  }
}

.fade-enter-active, .fade-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all 0.3s 0.2s;
}

.fade-enter {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
}

.fade-leave-to {
  opacity: 0;
}
</style>
