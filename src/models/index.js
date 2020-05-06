import request from './request'
import api from './api'

export default{
  courseList:function(data){
    return request.get(api.courseList,data)
  },
  courseCategory:function(data){
    return request.get(api.courseCategory,data)
  },
  courseSearch:function(data){
    return request.get(api.courseSearch,data)
  }
}