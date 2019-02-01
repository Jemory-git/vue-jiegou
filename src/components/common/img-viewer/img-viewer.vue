<template>
	<div class="slider" ref="slider">
		<div class="slider-group" ref="sliderGroup" id="slider-group">
			<slot></slot>
		</div>
		<div class="dots">
			<span class="dot" :class="{'active':currentPageIndex === index}" v-for="(item,index) in dots" :key="item" @click="_navToPage(navable,index)"></span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
// 使用说明： 此查看器需要在main.js中引入enlargeImg.js来获取页面中所有的图片。然后在需要放大图片的组件中图片数据回来后发射imgsrcgot事件通知main.js来获取图片。
// 在App.vue组件的最外层div上添加属性 id="app" class="app" ref="app"  @click="on_img_grow($event)" ；引入查看器组件，并设置相关属性
// 在需要放大的图片img元素上添加一个class名 'this-img-need-grow'，当点击img时事件会冒泡到App.vue组件的最外层div中；在图片上添加属性 :data-index1="index1" :data-index2="index2"
// 当点击事件发生时，执行App.vue中的相关方法（on_img_grow  + pagexchange + close_img_grow）
// App.vue中watch$route，切换页面后要重置currentIndex1的值
// main.js中取图片之前要先清掉查看器里的图片，因为这些图片并不需要。在APP.vue中保存当前组件CSS作用域值，加到新创建的标签上
// 有的组件是keepalive的，需要在activated中请求数据，才会再次进入该页面时通知main.js更新图片集合
import BScroll from "better-scroll";

export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    interval: {
      type: Number,
      default: 4000
    },
    navable: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 0.2
    },
    refreshTimes: {
      type: Number
    },
    turnToImgIndex: {
      type: String
    }
  },

  data() {
    return {
      dots: [],
      currentPageIndex: 0,
      wid: 0,
      widtot: 0
    };
  },

  methods: {
    update() {
      if (this.slider) {
        this.slider.destroy();
      }
      this.$nextTick(() => {
        this.init();
      });
    },
    init() {
      clearTimeout(this.timer);
      this.currentPageIndex = 0;
      this._setSliderWidth();
      this._initDots();

      this._initSlide();
      if (this.autoPlay) {
        this._play();
      }
    },
    // 设置轮播图的总宽度
    _setSliderWidth(isActive) {
      this.children = this.$refs.sliderGroup.children;

      let sliderWidth = window.innerWidth;
      let width = sliderWidth * this.children.length;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        child.classList.add("slide-item");
        child.style.width = sliderWidth + "px";
      }

      if (this.loop && !isActive && this.children.length > 1) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    //初始化dots
    _initDots() {
      this.dots = new Array(this.children.length);
    },
    // 初始化BScroll
    _initSlide() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: this.threshold,
          speed: 400
        },
        click: true
      });

      this.slider.on("beforeScrollStart", () => {
        if (this.autoPlay) {
          clearTimeout(this.timer);
        }
      });

      this.slider.on("scrollEnd", this._onScrollEnd);
      this.slider.on("touchEnd", this._onTouchEnd);
    },
    _onTouchEnd() {
      if (this.autoPlay) {
        this._play();
      }
    },
    _onScrollEnd() {
      let pageIndex = this.slider.getCurrentPage().pageX;
      this.currentPageIndex = pageIndex;
      // 通知App.vue 图片查看器翻页了，需要更改turnToImgIndex的值
      this.$emit("pagexchange", this.currentPageIndex);
      
      if (this.autoPlay) {
        this._play();
      }
    },

    //自动轮播
    _play() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.slider.next(400);
      }, this.interval);
    },

    //点击导航点跳到对应的图片
    _navToPage(navable, index) {
      if (navable) {
        this.slider.goToPage(index, 0, 400);
        this.currentPageIndex = index;
        if (this.autoPlay) {
          this._play();
        }
      }
    }
  },

  mounted() {
    // setTimeout(() => {
    //   this._setSliderWidth();
    //   this._initDots();
    //   this._initSlide();

    //   if (this.autoPlay) {
    //     this._play();
    //   }
    // }, 0);

    // 监听页面窗口改变 重新设置宽度和刷新BScroll
    window.addEventListener("resize", () => {
      if (!this.slider) {
        return;
      }
      this._setSliderWidth(true);
      this.slider.refresh();
    });
  },

  activated() {
    if (this.autoPlay) {
      this.slider.refresh();
    }
  },

  destoryed() {
    clearTimeout(this.timer);
  },
  watch: {
    refreshTimes() {
      this.update();
    },
    turnToImgIndex(v) {
      if (this.currentPageIndex == v) {
        // 当翻页时，组件会通知父组件更改turnToImgIndex的值，单是此时新值和当前页时相同的，return即可
        return;
      }
      this.slider.goToPage(parseInt(v));
    }
  }
};
</script>

<style scoped lang="stylus">
.slider {
  position: relative;
  min-height: 0.05rem;
  height: 100%;

  .slider-group {
    display: inline-flex;
    height: 100%;
    align-items: center;
  }

  .slider-item {
  }
}

.dots {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0.6rem;
  text-align: center;
  font-size: 0;

  .dot {
    display: inline-block;
    margin: 0 0.2rem;
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
  }

  .active {
    width: 1rem;
    border-radius: 0.25rem;
    background: rgba(255, 255, 255, 0.8);
  }
}
</style>