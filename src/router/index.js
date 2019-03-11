import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'

const Login = () => import('@/views/Login.vue')
const Group = () => import('@/views/Group.vue')
const Project = () => import('@/views/Project.vue')
const UserInfo = () => import('@/views/UserInfo.vue')

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            redirect: '/group',
            children: [
                {
                    path: '/group',
                    redirect: '/group/0'
                },
                {
                    path: '/project',
                    redirect: '/project/0'
                },
                {
                    path: '/group/:groupId',
                    name: 'group',
                    component: Group,
                    props: true
                },
                {
                    path: '/project/:projectId',
                    name: 'project',
                    component: Project,
                    props: true
                },
                {
                    path: '/user/:userId',
                    name: 'user',
                    component: UserInfo,
                    props: true
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        }
    ]
})
