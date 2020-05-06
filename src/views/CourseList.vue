<template>
  <div class="page-container">
    <form action="/">
      <van-search
        v-model="value"
        placeholder="请输入搜索关键词"
        @search="onSearch"
      />
    </form>
    <div class="page-info">
      <span class="page-tag">{{base_info.coursesCount}} 门课程</span> |
      <span class="page-tag">{{base_info.coursesLessonsCount}} 课时</span> |
      <span class="page-tag">{{base_info.total_duration}}</span>
    </div>
    <nut-infiniteloading
      @loadmore="onInfinite"
      :is-show-mod="true"
      :has-more="isHasMore"
      :is-loading="isLoading"
      :threshold="200">
      <div class="course-list">
        <router-link class="course-item"
          v-for="item in list"
          :key="item.id"
          :to="{path:'/detail/'+item.id}">
          <div class="course-new" v-if="item.status_label != 0">{{item.status_label}}</div>
          <div class="course-tag">{{item.difficulty_level_label}}</div>
          <img class="course-image" :src="item.cover_url">
          <div class="course-container">
            <div class="course-title">
              <div class="course-name">{{item.name}}</div>
              <div class="course-describe">互联网架构师必备技能</div>
            </div>
            <div class="course-info" v-if="item.is_bought === false">
              <div class="course-duration">
                <span>{{item.total_duration}}</span>
                <span>|</span>
                <span>{{item.contents_count}}课时</span>
              </div>
              <div class="course-price">
                <span class="present">{{item.is_vip === false ? '限时': item.current_price}}</span>
                <span class="before">{{item.original_price}}</span>
              </div>
            </div>
            <div class="course-bought" v-if="item.is_bought === true">已购买</div>
          </div>
        </router-link>
      </div>
    </nut-infiniteloading>
    <van-cell class="page-category" is-link @click="showPopup">课程分类</van-cell>
    <van-popup v-model="show" position="bottom" :style="{ height: '40%' }">
      <van-picker
        show-toolbar
        :columns="columns"
        @confirm="handOK"
        @cancel="handCancel"
        @change="change"/>
    </van-popup>
  </div>
</template>

<script>
import { Cell } from 'vant';
import indexModel from '../models/index'

export default {
  data() {
    return {
      list:[],
      base_info:{},
      page: 1,
      isHasMore: true,
      isLoading: false,
      timer: null,
      value: '',
      show: false,
      category_id:'',
      firstIndex:'',
      columns:[
        //第一列
        {
          values:[],
          defaultIndex: 0,
        },
        {
          values: [],
          defaultIndex: 1,
        },
      ]
    };
  },
  created(){
    indexModel.courseList().then(res => {
      this.base_info = res.data.data.base_info
      this.list = res.data.data.list
    })

    indexModel.courseCategory().then(res => {
      let categories = res.data.data.categories
      let name = categories.map(data => data.name)
      let id = categories.map(data => data.id)
      this.categories = categories
      this.columns[0].values = name
      this.columns[0].id = id
    })
  },
  methods:{
    onInfinite(){
      this.isLoading = true;
      this.timer = setTimeout(()=> {
        if(this.page <= 6){
          this.page++
          let page = this.page
          indexModel.courseList({page}).then(res => {
            let Data = res.data.data
            Data.list.forEach(data => {
              this.list.push(data)
            })
          })
        }else{
          this.isHasMore = false
        }
        this.isLoading = false
      }, 1000)
    },
    destroyed() {
      clearTimeout(this.timer);
    },
    showPopup(){
      this.show = true
      let firstIndex = this.firstIndex || 0
      indexModel.courseCategory().then(res => {
        let categories = res.data.data.categories[firstIndex]
        let second = categories.contents

        let name = second.map(data => data.name)
        this.columns[1].values = name
      })
    },
    change(picker){
      let firstIndex = picker.children[0].currentIndex
      this.firstIndex = firstIndex
      indexModel.courseCategory().then(res => {
        let categories = res.data.data.categories[firstIndex]
        let second = categories.contents

        let name = second.map(data => data.name)
        this.columns[1].values = name
        let secondIndex = picker.children[1].currentIndex
        this.category_id = second[secondIndex].id
      })
    },
    handOK:function(){
      let category_id = this.category_id
      let category_level = 2
      indexModel.courseList({category_id,category_level}).then(res => {
        this.list = res.data.data.list
        this.show = false
        this.isHasMore = false
      })
    },
    handCancel:function(){
      this.show = false
    },
    onSearch(val){
      let search_text = val
      if(val != ''){
        indexModel.courseSearch({search_text}).then(res => {
          this.list = res.data.data.list
          this.isHasMore = false
        })
      }else{
        indexModel.courseList().then(res => {
          this.base_info = res.data.data.base_info
          this.list = res.data.data.list
          this.isHasMore = true
        })
      }
    }
  },
  components:{
    'van-cell':Cell
  }
}
</script>

<style type="text/css" lang="less">
.page-container{
  position: relative;
  .page-info{
    padding: 0.26667rem 0.32rem;
    font-size: 0.33rem;
    color: #888888;
    span{
      margin: 0 5px;
    }
  }
  .course-list{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0.26667rem 0.32rem;
    .course-item{
      width: 165px;
      margin-bottom: 10px;
      box-shadow: 1px 1px 2px 2px #dddddd;
      display: flex;
      flex-direction: column;
      position: relative;
      .course-tag{
        position: absolute;
        width: 37px;
        height: 25px;
        line-height: 25px;
        padding-left: 5px;
        top: 0;
        right: 0.2rem;
        background: #000000;
        color: #ffffff;
        font-size: 0.2rem;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
      }
      .course-new{
        position: absolute;
        width: 42px;
        height: 25px;
        line-height: 25px;
        top: 0;
        font-size: 0.2rem;
        border-bottom-right-radius: 10px;
        background: #00BB00;
        color: #ffffff;
      }
      .course-image{
        width: 100%;
      }
      .course-container{
        font-family: 'Times New Roman', Times, serif;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-bottom: 0.3rem;
        color: #000000;
        .course-name{
          font-size: 0.25rem;
          text-align: left;
          padding: 0 0.2rem;
          font-weight: 500;
          line-height: 0.5rem;
        }
        .course-describe{
          font-size: 0.2rem;
          text-align: left;
          padding: 0.1rem 0.2rem;
          color: #888888;
        }
        .course-duration{
          font-size: 0.2rem;
          text-align: left;
          padding: 0.1rem 0.2rem;
          color: #888888;
          span{
            margin-right: 0.15rem;
          }
          span:first-child{
            padding-left: 0.4rem;
            position: relative;
          }
          span:first-child::before{
            content: '';
            background: url(../assets/time.png) no-repeat center;
            position: absolute;
            width: 0.3rem;
            height: 0.3rem;
            background-size: 0.3rem;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .course-price{
          font-family:sans-serif;
          text-align: left;
          line-height: 0.5rem;
          padding: 0 0.2rem;
          span{
            padding-left: 0.3rem;
            position: relative;
          }
          .present{
            font-size: 0.25rem;
            font-weight: 600;
            color: rgb(247, 6, 6);
          }
          .before{
            font-size: 0.2rem;
            color: #dddddd;
            margin-left: 0.2rem;
            position: relative;
          }
          .before::before{
            content: '';
            position: absolute;
            width: 100%;
            height: 1px;
            background: #dddddd;
            bottom: 35%;
            left: 0;
          }
          span::after{
            content:'￥';
            font-size: 0.2rem;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
  }
  .page-category{
    position: fixed;
    bottom: 5%;
    right: 5%;
    width: 3rem;
    height: 1.2rem;
    background: #000000;
    opacity: 0.8;
    padding: 0.26667rem;
    .van-cell__value.van-cell__value--alone{
      color: #ffffff;
      font-size: 0.38rem;
      text-align: right;
      margin-right: 0.2rem;
    }
    .van-icon.van-icon-arrow.van-cell__right-icon{
      position: absolute;
      background: #000000;
      color: #000000;
      background: url(../assets/menu.png) no-repeat center;
      background-size: 0.5rem;
    }
  }
}
.course-bought{
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  padding: 0.1rem 0.2rem;
  position: relative;
}
.course-bought::after{
  content: '';
  background: url(../assets/mark.png) no-repeat center;
  background-size: 14px;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  right: 10px;
}
</style>