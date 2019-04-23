import { getApi } from '@/services'
import { Message } from 'iview'

const state = {
    apiInfo: {} // 当前 api 信息
}

const getters = {
    apiInfo: () => state.apiInfo
}

const actions = {
    async fetchApiInfo({ commit }, interfaceId) {
        try {
            const res = await getApi({ interfaceId })
            console.log('fetchApiInfo res', res)
            if (res.code === 0) {
                commit('setApiInfo', res.data)
            } else {
                console.log('getApi fail', res.msg)
                Message.error(res.msg)
            }
        } catch (err) {
            console.log('fetchApiInfo err', err)
        }
    }
}

const mutations = {
    setApiInfo(state, info) {
        state.apiInfo = info
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
