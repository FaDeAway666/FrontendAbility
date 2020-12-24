import Vue from "vue";
import App from "./App.vue";

{{#if useRouter}}
import router from "./router";
{{/if}}

{{#if useStore}}
import store from "./store";
{{/if}}

{{#if usei18n}}
import i18n from './i18n';
{{/if}}


import './assets/styles/reset.{{cssType}}';

Vue.config.productionTip = false;

new Vue({
  {{#if useRouter}}
  router,
  {{/if}}
  {{#if useStore}}
  store,
  {{/if}}
  {{#if usei18n}}
  i18n,
  {{/if}}
  render: h => h(App)
}).$mount("#app");
