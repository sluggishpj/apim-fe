import axios from 'axios'
import { LoadingBar, Message } from 'iview'

// 设置超时时间
axios.defaults.timeout = 20000
axios.defaults.baseURL = '/api'

// 拦截请求
axios.interceptors.request.use(
    config => {
        LoadingBar.start()
        return config
    },
    error => {
        LoadingBar.error()
        Message.error(error.message)
        return Promise.reject(error)
    }
)

// 拦截响应
axios.interceptors.response.use(
    response => {
        LoadingBar.finish()
        return response.data
    },
    error => {
        LoadingBar.error()
        Message.error(error.message)
        return Promise.reject(error)
    }
)

// function doGet(url, params) {
//     return axios.get(url, { params })
// }

function doPost(url, params) {
    return axios.post(url, params)
}

// 登录
export const login = ({ username, password }) => doPost('/user/login', { username, password })

// 注册
export const register = ({ username, password }) => doPost('/user/register', { username, password })

// 获取个人相关信息
export const getUserInfo = () => doPost('/user/info')

// 修改用户名
export const updateUsername = ({ username }) => doPost('/user/update-username', { username })

// 退出
export const logout = () => doPost('/user/logout')

// 添加组
export const addGroup = ({ groupName, groupDesc }) =>
    doPost('/group/add-group', { groupName, groupDesc })

// 获取本人所有组
export const getGroupList = () => doPost('/group/group-list')

// 获取所有组员id及名字
export const getAllUser = () => doPost('/user/all-user')

// 添加组成员
export const addGroupMember = ({ groupId, userId }) =>
    doPost('/group/add-group-member', { groupId, userId })

// 修改组名
export const updateGroupName = ({ groupId, groupName }) =>
    doPost('/group/update-group-name', { groupId, groupName })

// 修改组描述
export const updateGroupDesc = ({ groupId, groupDesc }) =>
    doPost('/group/update-group-desc', { groupId, groupDesc })

// 删除分组
export const deleteGroup = ({ groupId }) => doPost('/group/delete-group', { groupId })

// 获取组成员
export const getGroupMember = ({ groupId }) => doPost('/group/group-member', { groupId })

// 设置组员角色
export const setGroupMemberRole = ({ groupId, userId, role }) =>
    doPost('/group/set-group-member-role', { groupId, userId, role })

// 删除组成员
export const deleteGroupMember = ({ groupId, userId }) =>
    doPost('/group/delete-group-member', { groupId, userId })
