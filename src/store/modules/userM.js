import { getUserInfo } from '@/services'
import { Message } from 'iview'

const state = {
    username: '', // 当前用户名，null代表未登录，非空代表已登录
    default_group: '' // 默认私人组
}

const getters = {
    username: state => state.username,
    default_group: state => state.default_group
}

const actions = {
    // 获取用户信息
    async fetchUserInfo({ dispatch, state, commit, rootState }) {
        try {
            const res = await getUserInfo()
            console.log('fetchUserInfo', res)
            if (res.code === 0) {
                // 成功，说明已登录
                commit('setUsername', res.data.username)
                commit('setDefaultGroup', res.data.default_group)
            } else {
                commit('setUsername', null)
                Message.error(res.msg)
            }
        }catch(err) {
            console.log('fetchUserInfo 服务器出错了', err)
            Message.error('服务器出错了')
        }
    }
}

const mutations = {
    // 保存当前用户名
    setUsername(state, username) {
        state.username = username
    },

    // 保存私人组id，管理员默认没有私人组
    setDefaultGroup(state, groupId) {
        state.default_group = groupId
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
