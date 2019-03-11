import Vue from 'vue'
import Vuex from 'vuex'

import userM from './modules/userM' // user相关

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        userM
    }
})
