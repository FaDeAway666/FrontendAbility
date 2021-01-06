import Vue from 'vue'
import Hello from '../components/HelloWorld.vue'
import VueRouter from '../VueRouter'
console.log('use')
Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Hello',
        component: Hello
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../components/About.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router