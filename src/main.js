import Vue from "vue";
import yueLazy from "@/Directives/lazy/index.js";
import yueEllipsis from "@/Directives/ellipsis/index.js";
import yueClickoutside from "@/Directives/clickoutside/index.js";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./style/tailwindcss.css";
import "./style/common.css";

Vue.use(yueEllipsis);
Vue.use(yueClickoutside);
Vue.use(yueLazy);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
