import { getGroupList, getGroupInfo, getGroupMember } from '@/services'
import { Message } from 'iview'

const state = {
    groupList: [], // 加入的所有组
    groupInfo: null, // 当前组信息
    groupMember: [] // 当前组组员
}

const getters = {
    groupList: state => state.groupList,
    groupInfo: state => state.groupInfo,
    groupMember: state => state.groupMember
}

const actions = {
    // 获取组列表
    async fetchGroupList({ commit }) {
        try {
            const res = await getGroupList()
            console.log('fetchGroupList', res)
            if (res.code === 0) {
                commit('setGroupList', res.data)
            } else {
                Message.error(res.msg)
            }
        } catch (err) {
            console.log('fetchGroupList err', err)
        }
    },

    // 获取某个组组信息
    async fetchGroupInfo({ state, commit }, { groupId }) {
        // 判断组列表中是否存在，不存在则进行获取
        let groupInfo = state.groupList.find(group => group.groupId === groupId)

        if (!groupInfo) {
            // 获取
            try {
                const res = await getGroupInfo({ groupId })
                console.log('fetchGroupInfo', res)
                if (res.code === 0) {
                    groupInfo = res.data
                } else {
                    Message.error(res.msg)
                }
            } catch (err) {
                console.log('fetchGroupInfo err', err)
            }
        }

        if (groupInfo) {
            groupInfo.groupName = groupInfo.groupName || '个人组'

            commit('setGroupInfo', groupInfo)
            // 修改面包屑
            commit('setBreadCrumbDesc', {
                name: 'group',
                title: `${groupInfo.groupName}`,
                path: `/group/${groupId}`
            })
        }
    },

    // 获取组员
    async fetchGroupMember({ commit }, { groupId }) {
        try {
            const res = await getGroupMember({ groupId })
            console.log('fetchGroupMember', res)
            if (res.code === 0) {
                commit('setGroupMember', res.data)
            } else {
                Message.error(res.msg)
            }
        } catch (err) {
            console.log('fetchGroupMember err', err)
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
    },

    // 设置当前组信息
    setGroupInfo(state, info) {
        state.groupInfo = info
    },

    setGroupMember(state, list) {
        state.groupMember = list
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
