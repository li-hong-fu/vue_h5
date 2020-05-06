import CourseList from "../views/CourseList.vue";
import CourseDetail from "../views/CourseDetail.vue";
import Login from "../views/Login.vue";

export default [
  {
    path:'/',
    name:'Index',
    component:CourseList,
    meta:{
      title:'课程列表'
    }
  },
  {
    path:'/detail/:id',
    name:'Detail',
    component:CourseDetail,
    meta:{
      title:'详情页'
    }
  },
  {
    path:'/login',
    name:'Login',
    component:Login,
    meta:{
      title:'登录'
    }
  }
]