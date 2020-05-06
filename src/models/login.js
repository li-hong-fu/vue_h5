import request from './request'
import api from './api'

export default {
  loginSMS:function(phone){
    return request.post(api.loginSMS,phone)
  },
  login:function(data){
    return request.post(api.login,data,{
      // 单独配置
      withCredentials: true
  })
  }
}