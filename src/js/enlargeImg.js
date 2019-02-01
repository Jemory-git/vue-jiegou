
function getAllneededImgs() {
  return document.querySelectorAll(".this-img-need-grow");
  // 或者使用document.images来获取所有图片，然后筛选需要放大的
}

function changeImgArr(imgarr) {
  let indexObj = {};
  // 根据index1创建名称为index1的数组
  imgarr.forEach((c, i) => {
    indexObj[c.dataset.index1] = [];
  });
  // 将img对象，放入名叫自己index1的值的数组中
  imgarr.forEach((c, i) => {
    indexObj[c.dataset.index1].push(c);
  });
  // 改造好的图片对象
  return indexObj;

}

export default {
    getAllneededImgs,
    changeImgArr
}