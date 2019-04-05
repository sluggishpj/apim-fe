import Vue from 'vue'
import Vuex from 'vuex'

import appM from './modules/appM' // user相关
import userM from './modules/userM' // user相关
import groupM from './modules/groupM' // user相关

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        appM,
        userM,
        groupM
    }
})
