const checkUserInput = {
  isPhoneNumber(n) {
    // return /^((13[0-9])|(14[4-8])|(15([0-3]|[5-9]))|(166)|(17[0-9])|(18[0-9]|(19[8|9])))\d{8}$/.test(n);
    return /^1[3456789]\d{9}$/.test(n);
  },
  lengthIs_6(v) {
    if (v.length !== 6) {
      return false
    }
    return true
  }
}
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const zhou = date.getDay()

  return {
    dateStr: [year, month, day].map(formatNumber).join('-'),
    monthStr: `${year}年${month}月`,
    timeStr: [hour, minute, second].map(formatNumber).join(':'),
    dateObj: {
      year,
      month: formatNumber(month),
      day: formatNumber(day),
      time: [hour, minute].map(formatNumber).join(':'),
      zhou: zhou == 0 ? 7 : zhou
    }
  }
}

const formatNumber = n => {
  // 个位数补零
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getQs = () => {
  // 获取url地址中？号后边的部分
  let url = window.location.search;
  let obj = {};
  // 制定正则匹配
  let reg = /[?&][^?&]+=[^?&]+/g;

  let arr = url.match(reg);
  // 获取到的是一个数组 eg:['?id=123','&a=b']

  // 如果获取到数组
  if (arr) {
    arr.forEach((item) => {
      let temArr = item.substring(1).split('=');
      let key = decodeURIComponent(temArr[0]);
      let val = decodeURIComponent(temArr[1]);
      obj[key] = val;
    });
  }
  return obj;
}
export {
  checkUserInput,
  formatTime,
  getQs
}
// export default {
//   abc: checkUserInput
// }
