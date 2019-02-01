/**
 * 提示框模块，导出等待框、确认框、提示框三个方法
 * 需要JQ的事件代理
 */

// 定义弹出框容器
let boxWrapperEl;
// 当同时需要弹出多个框时，需要计数，用于loaded方法
let loadingNumber = 0;

// 定义弹出框队列对象,多个弹出框同时弹出时需要排队
let storeObj = {
  promptArr: [],
  pushFn(fn) {
    // 当调用prompt和confirm方法时，将函数存入数组
    this.promptArr.push(fn);
    // console.log(this.promptArr[0])
    if (this.promptArr.length === 1) {
      // 长度等于1的时候才能执行
      this.execFnArr();
      return;
    }
  },
  removeFn() {
    // 当关闭弹出框时，移除数组中的方法
    // console.log(this.promptArr.length)
    this.promptArr.shift();
    // console.log(this.promptArr.length)
    if (this.promptArr.length > 0) {
      // 长度大于0的时候才能执行
      this.execFnArr();
      return;
    }
  },
  execFnArr() {
    // 执行
    this.promptArr[0]();
  }
}

function showBoxWrapper() {
  // 显示该容器
  getBoxWrapperEl().style.display = 'flex';
}

function hideBoxWrapper() {
  // 每当关闭弹出框的时候，都会执行下一个弹出框
  // 关闭该容器
  getBoxWrapperEl().style.display = 'none';

  // 移除上一个弹框绑定的委托事件
  $(getBoxWrapperEl()).unbind('click')
  // console.log('事件移除完毕')

  // 移除函数队列的第一个函数,执行下一个函数（弹框）
  storeObj.removeFn();
}

function getBoxWrapperEl() {
  // 获取弹出框的容器
  if (boxWrapperEl) {
    return boxWrapperEl;
  }

  boxWrapperEl = document.getElementById('prompt-box-wraper');
  // 当有弹出框时，阻止页面中的滚动和冒泡操作
  $(boxWrapperEl).on('touchmove', (e) => {
    e.preventDefault();
    e.stopPropagation();
  })
  return boxWrapperEl;
}

/**/
function createLoadingBox() {
  let loadingEl = '<img class="loading-img" src="data:image/gif;base64,R0lGODlhJQAlAJECAL3L2AYrTv///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgACACwAAAAAJQAlAAACi5SPqcvtDyGYIFpF690i8xUw3qJBwUlSadmcLqYmGQu6KDIeM13beGzYWWy3DlB4IYaMk+Dso2RWkFCfLPcRvFbZxFLUDTt21BW56TyjRep1e20+i+eYMR145W2eefj+6VFmgTQi+ECVY8iGxcg35phGo/iDFwlTyXWphwlm1imGRdcnuqhHeop6UAAAIfkEBQoAAgAsEAACAAQACwAAAgWMj6nLXAAh+QQFCgACACwVAAUACgALAAACFZQvgRi92dyJcVJlLobUdi8x4bIhBQAh+QQFCgACACwXABEADAADAAACBYyPqcsFACH5BAUKAAIALBUAFQAKAAsAAAITlGKZwWoMHYxqtmplxlNT7ixGAQAh+QQFCgACACwQABgABAALAAACBYyPqctcACH5BAUKAAIALAUAFQAKAAsAAAIVlC+BGL3Z3IlxUmUuhtR2LzHhsiEFACH5BAUKAAIALAEAEQAMAAMAAAIFjI+pywUAIfkEBQoAAgAsBQAFAAoACwAAAhOUYJnAagwdjGq2amXGU1PuLEYBACH5BAUKAAIALBAAAgAEAAsAAAIFhI+py1wAIfkEBQoAAgAsFQAFAAoACwAAAhWUL4AIvdnciXFSZS6G1HYvMeGyIQUAIfkEBQoAAgAsFwARAAwAAwAAAgWEj6nLBQAh+QQFCgACACwVABUACgALAAACE5RgmcBqDB2MarZqZcZTU+4sRgEAIfkEBQoAAgAsEAAYAAQACwAAAgWEj6nLXAAh+QQFCgACACwFABUACgALAAACFZQvgAi92dyJcVJlLobUdi8x4bIhBQAh+QQFCgACACwBABEADAADAAACBYSPqcsFADs=" alt="正在加载">';
  return loadingEl;
}

function createAutoHideBox(text) {
  let tishiText = `<span class="auto-hide-text scale-animation">${text}</span>`;
  return tishiText;
}

function createPromptBox(message) {
  let promptEl = `<div class="prompt-box scale-animation">
                        <p class="prompt-title">提示</p>
                        <p class="prompt-text">${message}</p>
                        <p class="prompt-btns">
                            <span class="prompt-confirm-btn prompt-btn-same-style">确定</span>
                        </p>
                    </div>`
  return promptEl;
}

function createConfirmBox(message) {
  let promptEl = `<div class="prompt-box scale-animation">
                        <p class="prompt-title">提示</p>
                        <p class="prompt-text">${message}</p>
                        <p class="prompt-btns">
                            <span class="prompt-cancle-btn prompt-btn-same-style">取消</span>
                            <span class="prompt-confirm-btn prompt-btn-same-style">确定</span>
                        </p>
                    </div>`
  return promptEl;
}

/**/
function bindEvent(confirmCb) {
  // console.log('进入事件绑定')
  // 绑定弹出框容器中确定按钮的代理事件
  $(getBoxWrapperEl()).delegate('.prompt-confirm-btn', 'click', () => {
    loadingNumber--;
    // 关闭容器
    // console.log('关闭容器')
    hideBoxWrapper();
    // 执行回调
    // console.log('执行回调')
    confirmCb();
  })
  // 绑定弹出框容器中取消按钮的代理事件
  $(getBoxWrapperEl()).delegate('.prompt-cancle-btn', 'click', () => {
    loadingNumber--;
    // 关闭容器
    hideBoxWrapper();
  })
}

function loading() {
  loadingNumber++;
  showBoxWrapper();
  getBoxWrapperEl().innerHTML = createLoadingBox();
}

function loaded() {
  if (loadingNumber-- !== 1) {
    return;
  }
  // 关闭该容器
  getBoxWrapperEl().style.display = 'none';
}

function prompt(message, confirmCb = function () {}) {
  loadingNumber++;
  // 更新弹出框队列，函数队列的每一个函数都做三件事，显示容器+绑定事件+更新文字
  storeObj.pushFn(function () {
    // 显示容器
    // console.log('显示容器')
    showBoxWrapper()
    // 绑定事件
    bindEvent(confirmCb);
    // 更新文字
    getBoxWrapperEl().innerHTML = createPromptBox(message)
  })
}

function confirm(message, confirmCb = function () {}) {
  loadingNumber++;
  // 更新弹出框队列
  storeObj.pushFn(function () {
    // 显示容器
    showBoxWrapper()
    // 绑定事件
    bindEvent(confirmCb);
    // 更新文字
    getBoxWrapperEl().innerHTML = createConfirmBox(message)
  })
}

function autoHide(text, time = 1500) {
  loadingNumber++;
  showBoxWrapper();
  getBoxWrapperEl().innerHTML = createAutoHideBox(text);
  setTimeout(() => {
    loaded();
  }, time);
}

function reInit() {
  // 重置计数器
  loadingNumber = 0;
  // 关闭容器
  getBoxWrapperEl().style.display = 'none';
}
export default {
  loading,
  loaded,
  prompt,
  confirm,
  autoHide,
  reInit
}

/*
 * end
 */
