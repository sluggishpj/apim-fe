import Vue from 'vue'
import Vuex from 'vuex'

import appM from './modules/appM' // 面包屑相关
import userM from './modules/userM' // 用户相关
import groupM from './modules/groupM' // 组相关
import projectM from './modules/projectM' // 项目相关
import apiM from './modules/apiM' // 接口相关

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        appM,
        userM,
        groupM,
        projectM,
        apiM
    }
})
