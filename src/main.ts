import "./firebase";

import Vue from "vue";
// import App from "./App.vue";
import App from "./App";
import { rtdbPlugin } from "vuefire";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlus,
  faEdit,
  faTrashAlt,
  faSave,
  faTimesCircle,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

Vue.config.productionTip = false;

library.add(faPlus, faEdit, faTrashAlt, faSave, faTimesCircle, faCheck);
// Vue.component("Icon", FontAwesomeIcon); //typescript will error on 'Icon' if consumed as global component
Vue.component("FontAwesomeIcon", FontAwesomeIcon);

Vue.use(rtdbPlugin);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
