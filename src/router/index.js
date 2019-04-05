import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
Vue.use(Router)

const router = new Router({
    routes,
    mode: 'history'
})

router.beforeEach((to, from, next) => {
    store.commit('setCurrentBreadCrumb', to.name)
    next()
})

export default router
