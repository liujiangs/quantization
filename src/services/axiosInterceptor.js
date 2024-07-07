import axios from 'axios'
import app from '@/main.js'

const axiosService = {
  axios: axios.create({
    // baseURL: process.env.VUE_APP_HOST
    // baseURL: 'http://dev.hsop.site:18140'
    // baseURL: 'https://quantapi.51ifind.com/api/v1/'
    baseURL: '/api'
    // baseURL: appSetting.baseUrl
    // timeout: 10000
  })
}

axiosService.axios.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json'
  config.headers['access_token'] = '22da97031e0db94a30c25229bfd26830a3149293.signs_NzIwNzI4NTcz'
  return config
}, error => {
  app.$message.error('接口错误！')
  Promise.reject(error)
})

axiosService.axios.interceptors.response.use(
  response => {
    
    return Promise.resolve(response.data)
  },
  error => {
    // app.$message.error(error?.response?.data?.msg || '接口错误！')
    return Promise.reject(error)
  }
)

export const getAction = function(url = '', param = {}) {
  return axiosService.axios.get(url, param)
}
export const postAction = function(url = '', data = {}, config = {}) {
  return axiosService.axios.post(url, data, config)
}
export const putAction = function(url = '', data = {}, config = {}) {
  return axiosService.axios.put(url, data, config)
}
export const patchAction = function(url = '', data = {}, config = {}) {
  return axiosService.axios.patch(url, data, config)
}
export const deleteAction = function(url = '', data = {}, config = {}) {
  return axiosService.axios.delete(url, data, config)
}
