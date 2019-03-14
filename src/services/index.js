import axios from 'axios'
import { LoadingBar } from 'iview'

// 拦截请求
axios.defaults.timeout = 30000
axios.defaults.baseURL = '/api'
axios.interceptors.request.use(config => {
    LoadingBar.start()
    return config
}, error => {
    LoadingBar.error()
    return Promise.reject(error)
})

// 拦截响应
axios.interceptors.response.use(
    response => {
        LoadingBar.finish()
        return response.data
    },
    error => {
        LoadingBar.error()
        return Promise.reject(error.response.data)
    }
)

function doGet(url, params) {
    return axios.get(url, { params })
}

function doPost(url, params) {
    return axios.post(url, params)
}

// 登录
export const login = ({ username, password }) => doPost('/user/login', { username, password })

// 注册
export const register = ({ username, password }) =>
    doPost('/user/register', { username, password })

// 获取个人相关信息
export const getUserInfo = () => doPost('/user/info')

// 更新个人信息
export const updateUserInfo = data => doPost('/user/update', data)

// 退出
export const logout = () => doPost('/user/logout')

// 添加组
export const addGroup = data => doPost('/group/add-group', data)

// 获取本人所有组
export const getGroupList = () => doPost('/group/group-list')

// 获取所有组员id及名字
export const getAllUser = () => doPost('/user/all-user')

// 添加组成员
export const addGroupMember = (data) => doPost('/group/add-group-member', data)
