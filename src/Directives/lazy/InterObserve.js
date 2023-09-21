let imgs = [];
function loadingImg(imgDOM) {
  const imgSrc = imgs.filter((img) => img.dom === imgDOM)[0].src;
  const tempImg = new Image();
  tempImg.onload = function () {
    imgDOM.src = imgSrc;
  };
  tempImg.src = imgSrc;
  imgs = imgs.filter((img) => img.dom !== imgDOM);
}
const io = new IntersectionObserver((entries) => {
  entries.forEach((item) => {
    if (item.isIntersecting) {
      // 判断目标元素当前是否可见
      loadingImg(item.target);
      io.unobserve(item.target);
    }
  });
  // if (!imgs.length) io.disconnect();//终止所有观察
});

export default {
  inserted(el, bindings) {
    io.observe(el); // 开始监听该img元素
    const img = {
      dom: el,
      src: bindings.value,
    };
    imgs.push(img);
  },
  unbind(el) {
    io.unobserve(el); // 停止监听
    imgs = imgs.filter((img) => img.dom !== el);
  },
};
