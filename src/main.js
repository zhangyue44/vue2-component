import Vue from "vue";
import ZyEllipsis from "@/components/v-eliipsis/index";
import ZyClikoutside from "@/components/v-clickoutside/index";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/style/common.css";

Vue.config.productionTip = false;
Vue.use(ZyEllipsis);
Vue.use(ZyClikoutside);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
