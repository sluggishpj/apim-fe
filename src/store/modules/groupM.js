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
    async fetchGroupList({ state, commit }) {
        if (state.groupList.length === 0) {
            // 还没获取过
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
                console.log('fetchGroupList err', err)
            }
        }
    }
}

const mutations = {
    // 保存当前加入的所有组
    setGroupList(state, list) {
        state.groupList = list
    },

    // 删除某个组
    deleteGroup(state, { groupId }) {
        const { groupList } = state
        const idx = groupList.findIndex(group => group.groupId === groupId)
        groupList.splice(idx, 1)
    },

    // 添加某个组
    addGroup(state, newGroup) {
        state.groupList.push(newGroup)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
