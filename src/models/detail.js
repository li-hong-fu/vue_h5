import request from './request'
import api from './api'

export default {
  courseDetail:function(id,data){
    return request.get(api.courseDetail(id),data)
  },
  userInfo:function(data){
    return request.get(api.userInfo,data)
  }
}