import ZyEllipsis from "./v-ellipsis";

ZyEllipsis.install = (Vue) => {
  Vue.directive("zyellipsis", ZyEllipsis);
};

export default ZyEllipsis;
