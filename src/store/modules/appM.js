import { breadCrumbDesc, getBreadNameList } from '@/router/desc'

const state = {
    breadCrumbList: [],
    breadCrumbDesc
}

const getters = {
    breadCrumbList: () => state.breadCrumbList,
    breadCrumbDesc: () => state.breadCrumbDesc
}

const actions = {}

const mutations = {
    // 设置面包屑描述
    setBreadCrumbDesc(state, { name, title = '', path = '', icon = '' }) {
        // 设置面包屑名相关信息
        let target = state.breadCrumbDesc[name]
        target.icon = icon || target.icon
        target.title = title
        target.path = path
    },

    // 设置当前的面包屑
    setCurrentBreadCrumb(state, name) {
        const breadNameList = getBreadNameList(name)
        const breadCrumbList = []
        let desc = state.breadCrumbDesc

        breadNameList.forEach(name => {
            breadCrumbList.push(desc[name])
        })
        state.breadCrumbList = breadCrumbList
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
