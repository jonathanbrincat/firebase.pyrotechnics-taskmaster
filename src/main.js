import "./firebase";

import Vue from "vue";
import App from "./App.vue";
import { rtdbPlugin } from "vuefire";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlus,
  faEdit,
  faTrashAlt,
  faSave,
  faTimesCircle,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

Vue.config.productionTip = false;

library.add([faPlus, faEdit, faTrashAlt, faSave, faTimesCircle, faCheck]);
Vue.component("Icon", FontAwesomeIcon);

Vue.use(rtdbPlugin);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
