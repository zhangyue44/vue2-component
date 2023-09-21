// import yueLazy from './lazy.js';
import yueLazy from "./InterObserve.js";

function install(Vue) {
  Vue.directive("yueLazy", yueLazy);
}
export default { install };
