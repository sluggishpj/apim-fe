import { doPost } from './base'

// 登录
export function login({ username, password }) {
    return doPost('/user/login', { username, password })
}

// 注册
export function register({ username, password }) {
    return doPost('/user/register', { username, password })
}

// 获取个人相关信息
export function getUserInfo() {
    return doPost('/user/info')
}

// 修改用户名
export function updateUsername({ username }) {
    return doPost('/user/update-username', { username })
}

// 退出
export function logout() {
    return doPost('/user/logout')
}
