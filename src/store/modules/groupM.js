import { getGroupList } from '@/services'
import { Message } from 'iview'

const state = {
    groupList: [] // 加入的所有组
}

const getters = {
    groupList: state => state.groupList
}

const actions = {
    // 获取组列表
    async fetchGroupList({ commit }) {
        try {
            const res = await getGroupList()
            console.log('fetchGroupList', res)
            if (res.code === 0) {
                // 成功，说明已登录
                commit('setGroupList', res.data)
            } else {
                Message.error(res.msg)
            }
        } catch (err) {
            console.log('fetchGroupList 服务器出错了', err)
            Message.error('服务器出错了')
        }
    }
}

const mutations = {
    // 保存当前加入的所有组
    setGroupList(state, list) {
        state.groupList = list
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
