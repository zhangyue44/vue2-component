import { debounce } from "lodash";
import { EventBus } from "@/EventBus.js";

let imgs = [];
function setImage(img) {
  const temp = document.querySelector(".scroll-record");
  const { clientHeight } = temp;
  const tempRect = temp.getBoundingClientRect();
  const rect = img.dom.getBoundingClientRect();
  if (rect.top - tempRect.top < clientHeight) {
    const tempImg = new Image();
    tempImg.onload = function () {
      img.dom.src = img.src;
    };
    tempImg.src = img.src;
    imgs = imgs.filter((i) => i.dom !== img.dom);
  }
}
/* eslint-disable no-restricted-syntax */
function setImages() {
  for (const img of imgs) {
    if (img.src) setImage(img);
  }
}
EventBus.$on("mainScroll", debounce(setImages, 100));

export default {
  inserted(el, bindings) {
    const img = {
      dom: el,
    };
    imgs.push(img);
  },
  update(el, bindings) {
    if (!bindings.value) return;
    const temp = imgs.find((i) => i.dom === el);
    if (!temp) return;
    temp.src = bindings.value;
    setImage(temp);
  },
  unbind(el) {
    imgs = imgs.filter((img) => img.dom !== el);
  },
};
