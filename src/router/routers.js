import Home from '@/views/Home.vue'

const Login = () => import('@/views/Login.vue')
const Group = () => import('@/views/Group.vue')
const Project = () => import('@/views/Project.vue')
const UserInfo = () => import('@/views/UserInfo.vue')
const AddGroup = () => import('@/views/group/AddGroup.vue')
const AddProject = () => import('@/views/project/AddProject.vue')
const AddGroupMember = () => import('@/views/group/AddGroupMember.vue')

// 参考来源：https://github.com/iview/iview-admin/blob/master/src/router/routers.js

/**
 * meta中除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在面包屑和的文字
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */
export default [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/',
        name: '_home',
        component: Home,
        redirect: '/group',
        meta: {
            hideInBread: true
        },
        children: [
            {
                path: '/group',
                redirect: '/group/0',
                name: 'home',
                meta: {
                    title: '首页',
                    icon: 'md-home'
                }
            },
            {
                path: '/group/:groupId',
                name: 'group',
                component: Group,
                props: true,
                meta: {
                    hideInBread: true
                }
            },
            {
                path: '/project',
                redirect: '/project/0'
            },
            {
                path: '/project/:projectId',
                name: 'project',
                component: Project,
                props: true
            },
            {
                path: '/user/:userId',
                name: 'user-info',
                component: UserInfo,
                props: true
            },
            {
                path: '/add-group',
                name: 'add-group',
                component: AddGroup,
                meta: {
                    title: '添加组'
                }
            },
            {
                path: '/add-group-member',
                name: 'add-group-member',
                component: AddGroupMember,
                meta: {
                    title: '添加组成员'
                }
            },
            {
                path: '/add-project',
                name: 'add-project',
                component: AddProject,
                meta: {
                    title: '添加项目'
                }
            }
        ]
    }
]
