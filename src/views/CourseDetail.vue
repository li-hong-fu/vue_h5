<template>
  <div class="page-container">
    <div class="course-play">
      <video controls :src="video" class="course-video"/>
      <div class="course-content">
        <div class="video-title">{{course.name}}</div>
        <div class="video-info">
          <span>{{course.total_duration}}</span>
          <span>|</span>
          <span>{{course.contents_count}}课时</span>
        </div>
        <div class="video-container" v-if="course.is_bought === false">
          <div class="price_info">
            <span class="present">{{course.current_price}}</span>
            <span class="before">{{course.original_price}}</span>
          </div>
          <div class="member_info"><span>VIP</span> 免费学</div>
        </div>
        <div class="video-bought" v-if="course.is_bought === true">已购买</div>
      </div>
    </div>
    <van-collapse v-model="activeNames" :border="false">
      <van-collapse-item
        v-for="(list,index) in course.content"
        :key="list.id"
        :name="index"
        :border="false"
        :is-link="false">
        <template #title>
          <div>第{{index+1}}章 :</div>
          <div>{{list.name}}</div>
        </template>
        <div class="video-item"
          v-for="(item,indexs) in list.children"
          :key="indexs"
          :class="{'active':isActive===item.id}"
          @click="lookVideo(item)">
          <div class="video-item_title">
            <span class="number">{{indexs+1}}</span>{{item.name}}
          </div>
          <div class="video-item_time active">{{item.duration}}</div>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import detailModel from "../models/detail"
export default {
  data(){
    return {
      activeNames: [0],
      course:{},
      video:'',
      isActive:224
    }
  },
  created(){
    let id = this.$route.params.id
    detailModel.courseDetail(id).then(res => {
      this.course = res.data.data.course
      console.log(this.course)
    })
  },
  methods:{
    lookVideo(item){
      this.isActive = item.id
      this.video = item.url
      detailModel.userInfo().then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style type="text/css" lang="less">
.page-container{
  height: 100%;
  .course-play{
    .course-video{
      width: 100%;
      background: #000000;
    }
    .course-content{
      margin: 0 0.3rem;
      padding: 0.3rem 0;
      border-bottom: 1px solid #dddddd;
      .video-title{
        font-size: 0.45rem;
        font-weight: 500;
        font-family: Georgia, 'Times New Roman', Times, serif;
        text-align: left;
      }
      .video-info{
        font-size: 0.35rem;
        text-align: left;
        margin: 0.3rem 0;
        color: #888888;
        span{
          padding-right: 0.2rem;
        }
        span:first-child{
          padding-left: 0.5rem;
          position: relative;
        }
        span:first-child::after{
          content: '';
          position: absolute;
          background: url(../assets/time.png) no-repeat center;
          width: 0.4rem;
          height: 0.4rem;
          background-size: 0.4rem;
          left: 0;
          top: 50%;
          transform: translateY(-55%);
        }
      }
      .video-container{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.4rem;
        .price_info{
          .present{
            color: rgb(247, 6, 6);
            padding-left: 0.3rem;
          }
          span{
            position: relative;
          }
          .before{
            color: #dddddd;
            position: relative;
            padding-left: 0.3rem;
            margin-left: 0.2rem;
          }
          .before::before{
            content: '';
            position: absolute;
            width: 100%;
            height: 1px;
            background: #dddddd;
            bottom: 40%;
            left: 0;
          }
          span::after{
            content:'￥';
            position: absolute;
            font-size: 0.3rem;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .member_info{
          width: 2rem;
          line-height: 0.8rem;
          background: #dddddd;
          font-size: 0.35rem;
          position: relative;
          z-index: 1;
          margin:0 0.3rem;
          span{
            color: #EAC100;
          }
        }
        .member_info::after{
          content: '';
          position: absolute;
          background: #dddddd;
          height: 0.8rem;
          width: 0.8rem;
          border-radius: 50%;
          right: -0.3rem;
          z-index: -1;
        }
        .member_info::before{
          content: '';
          position: absolute;
          background: #dddddd;
          height: 0.8rem;
          width: 0.8rem;
          border-radius: 50%;
          left: -0.3rem;
          z-index: -1;
        }
      }
    }
  }
  .van-collapse{
    text-align: left;
    // margin: 0.3rem 0.2rem 0 0.2rem;
    margin-top: 10px;
    .van-cell__title{
      font-size: 0.4rem;
      font-weight: 600;
      display: flex;
      padding-left: 10px;
      div:first-child{
        width: 60px;
      }
    }
    .video-item{
      display: flex;
      justify-content: space-between;
      color: #4F4F4F;
      line-height: 1.3rem;
      padding: 0 10px;
      .video-item_title{
        width: 70%;
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow:hidden; 
        .number{
          display: inline-block;
          width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          background: #ffffff;
          border-radius: 50%;
          border: 1px solid #ADADAD;
          margin-right: 10px;
        }
      }
    }
    .video-item.active{
      background: #dddddd;
      border-radius: 0.2rem;
    }
  }
}
.video-bought{
  font-size: 18px;
  font-weight: 600;
  text-align: left;
  padding: 0.1rem 0.2rem;
  position: relative;
}
.video-bought::after{
  content: '';
  background: url(../assets/mark.png) no-repeat center;
  background-size: 24px;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
}
</style>