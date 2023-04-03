import Vue from "vue";
import ZyEllipsis from "@/components/v-eliipsis/index";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/style/common.css";

Vue.config.productionTip = false;
Vue.use(ZyEllipsis);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
