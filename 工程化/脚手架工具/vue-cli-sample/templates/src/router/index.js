import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import('../views/Index.vue')
  }
];

const router = new VueRouter({
  routes: routes
});

export default router;


