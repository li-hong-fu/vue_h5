import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import 'amfe-flexible';
import { Search } from 'vant';
import { List } from 'vant';
import { Popup } from 'vant';
import { Picker } from 'vant';
import { Collapse, CollapseItem } from 'vant';
import NutUI from '@nutui/nutui';
import '@nutui/nutui/dist/nutui.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;

Vue.use(Search);
Vue.use(List);
Vue.use(Popup);
Vue.use(Picker);
Vue.use(Collapse);
Vue.use(CollapseItem);
NutUI.install(Vue);
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
