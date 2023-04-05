import ZyClikoutside from "./v-clickoutside";

ZyClikoutside.install = (Vue) => {
  Vue.directive("zyclickoutside", ZyClikoutside);
};

export default ZyClikoutside;
