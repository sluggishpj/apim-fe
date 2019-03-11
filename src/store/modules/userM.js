import { getUserInfo } from '@/services'

const state = {
    username: '' // 当前用户名，null代表未登录，非空代表已登录
}

const getters = {
    username: state => state.username
}

const actions = {
    // 获取用户信息
    async fetchUserInfo({ dispatch, state, commit, rootState }) {
        const res = await getUserInfo()
        console.log('fetchUserInfo', res)
        if (res.code === 0) {
            // 成功，说明已登录
            commit('setUsername', res.data.username)
        } else {
            commit('setUsername', null)
        }
    }
}

const mutations = {
    // 保存当前用户名
    setUsername(state, username) {
        state.username = username
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
