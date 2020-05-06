<template>
  <div class="login-container">
    <div class="info-container">
      <img class="info-logo" src="~@/assets/logo.png" />
      <span class="info-name">视频课H5登录</span>
    </div>
    <el-form
      :model="smsFrom"
      status-icon
      :rules="smsRules"
      ref="smsFrom"
      class="demo-ruleForm">
      <el-form-item prop="phone">
        <el-input
          type="number"
          prefix-icon="el-icon-mobile-phone"
          placeholder="请输手机号"
          v-model="smsFrom.phone"
          autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <div class="flex-cell">
          <el-input
            class="flex-cell-bd"
            type="number"
            placeholder="请输入验证码"
            v-model="smsFrom.code"
            autocomplete="off"
            prefix-icon="el-icon-mobile"
          ></el-input>
          <el-button
            :disabled="disabled"
            class="flex-cell-ft"
            @click="handleSendCode"
            >{{ buttonName  }}</el-button
          >
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="width: 100%"
          @click="submitForm('smsFrom')"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import login from '../models/login'
import Cookies from 'js-cookie'
export default {
  data(){
    return{
      smsFrom:{
        phone:'',
        code:''
      },
      smsRules:{
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "目前只支持中国大陆的手机号码",
            trigger: "blur"
          }
        ]
      },
       buttonName: "获取验证码",
       disabled: false
    }
  },
  created(){
    console.log(Cookies.get('token'))
    if(Cookies.get('token')){
      this.$router.push({path:'/'})
    }
  },
  methods:{
    handleSendCode(){
      if (this.disabled) {
        return;
      }

      let phone_number  = `+86${this.smsFrom.phone}`

      this.$refs.smsFrom.validateField("phone",errMsg => {
        if(errMsg)return
        this.disabled = true;

        login.loginSMS({phone_number}).then(res => {
          console.log(res)
          this.$message.success("验证码发送成功！");
          let time = 60;
          this.buttonName = `(${time})秒重新发送`;
          const interval = window.setInterval(() => {
            time -=1;
            this.buttonName = `(${time})秒重新发送`;
            if(time <= 0){
              this.buttonName = '重新发送';
              this.disabled = false
              window.clearInterval(interval)
            }
          },1000)
        })
      })
    },
    submitForm(formName){
      let phone_number  = `+86 ${this.smsFrom.phone}`
      let code = this.smsFrom.code
      this.$refs[formName].validate(valid => {
        if(valid){
          login.login({phone_number,code}).then(res => {
            if(res.data.code === 200){
              this.$router.push({path:'/'})
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container{
  background: #f0f2f5;
  height: 100vh;
  background-position: center;
  padding: 40px 15px 0 15px;
  box-sizing: border-box;
}
.info-container{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  .info-logo{
    height: 44px;
    margin-right: 20px;
  }
  .info-name{
    line-height: 44px;
    font-size: 33px;
    font-weight: 600;
    font-family: Avenir;
  }
}
.flex-cell{
  display: flex;
  .flex-cell-bd {
    flex: 1;
  }
  .flex-cell-ft {
    width: 130px;
    margin-left: 8px;
    &:after {
      display: none;
    }
    &.link {
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      color: #409eff;
      text-decoration: none;
    }
  }
}
</style>