import { getSelfInfo } from '@/services'
import { Message } from 'iview'

const state = {
    userInfo: {
        username: '', // 用户名，非空代表已登录
        defaultGroup: '', // 默认私人组
        groupId: '', // 用户id
        role: 'member' // 用户角色
    }
}

const getters = {
    userInfo: state => state.userInfo
}

const actions = {
    // 获取用户信息
    async fetchSelfInfo({ commit }) {
        try {
            const res = await getSelfInfo()
            console.log('fetchSelfInfo', res)
            if (res.code === 0) {
                // 成功，说明已登录
                commit('setUserInfo', res.data)
            }
        } catch (err) {
            console.log('fetchSelfInfo 服务器出错了', err)
            Message.error('服务器出错了')
        }
    }
}

const mutations = {
    setUserInfo(state, info) {
        state.userInfo = info
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
