import { getProjectInfo } from '@/services'
import { Message } from 'iview'

const state = {
    projectInfo: {} // 当前项目信息
}

const getters = {
    projectInfo: state => state.projectInfo
}

const actions = {
    // 获取某个项目信息
    async fetchProjectInfo({ state, commit, dispatch, rootState }, { projectId }) {
        try {
            const res = await getProjectInfo({ projectId })
            console.log('fetchProjectInfo', res)
            if (res.code === 0) {
                commit('setProjectInfo', res.data)

                // 修改面包屑
                commit('setBreadCrumbDesc', {
                    name: 'project',
                    title: res.data.projectName,
                    path: `/project/${res.data.projectId}`
                })

                // 判断该项目对应的组信息是否已获取，没有则进行获取
                if (!rootState.groupM.groupInfo) {
                    dispatch('fetchGroupInfo', { groupId: res.data.groupId })
                }
            } else {
                Message.error(res.msg)
            }
        } catch (err) {
            console.log('fetchProjectInfo err', err)
        }
    }
}

const mutations = {
    setProjectInfo(state, info) {
        state.projectInfo = info
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
