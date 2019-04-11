import Home from '@/views/Home.vue'

const Login = () => import('@/views/Login.vue')
const Group = () => import('@/views/Group.vue')
const Project = () => import('@/views/Project.vue')
const ProjectHome = () => import('@/views/project/ProjectHome.vue')
const UserInfo = () => import('@/views/UserInfo.vue')
const AddGroup = () => import('@/views/group/AddGroup.vue')
const AddProject = () => import('@/views/project/AddProject.vue')
const AddGroupMember = () => import('@/views/group/AddGroupMember.vue')
const AddProjectMember = () => import('@/views/project/AddProjectMember.vue')

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
                props: true
            },
            {
                path: '/project',
                redirect: '/project/0'
            },
            {
                path: '/project/:projectId',
                component: Project,
                props: true,
                children: [
                    {
                        path: '',
                        name: 'project',
                        component: ProjectHome
                    },
                    {
                        path: 'add-project-member',
                        name: 'add-project-member',
                        component: AddProjectMember
                    }
                ]
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
