import axios from 'axios'
import { LoadingBar, Message } from 'iview'

// 设置超时时间
axios.defaults.timeout = 20000
axios.defaults.baseURL = '/api'

// 拦截请求
axios.interceptors.request.use(
    config => {
        LoadingBar.start()
        return config
    },
    error => {
        LoadingBar.error()
        Message.error(error.message)
        return Promise.reject(error)
    }
)

// 拦截响应
axios.interceptors.response.use(
    response => {
        LoadingBar.finish()
        return response.data
    },
    error => {
        LoadingBar.error()
        Message.error(error.message)
        return Promise.reject(error)
    }
)

export function doGet(url, params) {
    return axios.get(url, { params })
}

export function doPost(url, params) {
    return axios.post(url, params)
}
