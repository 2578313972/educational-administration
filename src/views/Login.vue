<template>
  <div id="Login"  >
      <div class="content">
        <div class="content_left">
          <div><img class="img" src="../assets/logo.png" /></div>
          <h2>智学无忧后台系统</h2>
          <p>做最有态度、责任、良心的IT教具</p>
        </div>
        <div class="content_mid"></div>
        <div class="content_right">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
            <el-form-item class="Ficon" inline-message=false prop="userName">
              <el-input class="Ficon_inp"  type="text" v-model="ruleForm.userName" autocomplete="off"></el-input>
              <i class="el-icon-user-solid icon icon_one"></i>
            </el-form-item>
            <el-form-item class="Ficon" prop="userPassword">
              <el-input class="Ficon_inp" type="password" v-model="ruleForm.userPassword" autocomplete="off"></el-input>
              <i class="el-icon-lock icon icon_two"></i>
            </el-form-item>
            <el-form-item>
              <el-checkbox-group v-model="ruleForm.type">
                <el-checkbox label="记住密码" name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button class="submi" type="primary" @click="submitForm('ruleForm')">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
  </div>
</template>

<script>
  import Api from '@/http/Login'
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号！'));
        } else {
          let a = /^\w{4,16}$/
          if(!a.test(value)) callback(new Error('账号长度 4~16'));
          setTimeout(callback,500)
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码！'));
        } else{
          let a = /^\w{4,16}$/
          if(!a.test(value)) callback(new Error('密码长度 4~16'));
          setTimeout(callback,500)
        }
      };
      return {
        ruleForm: {
          userName: '', // 用户名
          userPassword: '', // 密码
          type:true　// 是否记住密码（默认记住）
        },
        rules: {
          userName: [
            { validator: validatePass, trigger: 'blur' }
          ],
          userPassword: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      };
    },
    created() {
      console.log(this.$route.query.redirect);
      console.log(this.$router);

      if(this.Cookie.getCookie("userInfo")){
        /**
         * 检查是否记住过密码
         */
        let userInof = JSON.parse(this.Base64.decode(this.Cookie.getCookie("userInfo")))
        this.ruleForm.userName = userInof.userMobile
        this.ruleForm.userPassword = userInof.userPassword
      }
    },
    methods: {
      submitForm(formName) {
        let that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            Api.authenticate({
              userMobile:this.ruleForm.userName,
              userPassword:this.ruleForm.userPassword
            }).then(res=>{
                that.$message({message: '登录成功正在进行跳转……',type: 'success'});
                setTimeout(()=>{
                  if(that.ruleForm.type){
                    that.Cookie.setCookie("userInfo",that.Base64.encode(JSON.stringify(res.config.params))) // 加密保存用户信息的账号密码
                  }else{
                    that.Cookie.removeCookie("userInfo")
                  }
                  // 将token值加密并将加密token存在cookie中
                  that.Cookie.setCookie('token',that.Base64.encode(res.data.token_type+" "+res.data.access_token),{maxAge:60*20,domain:"localhost",path:"/"})
                  // 储存用户信息

                  sessionStorage.setItem("userData",JSON.stringify(res.data.profile))
                  if(this.$route.query.redirect){
                    this.$router.replace(this.$route.query.redirect) // 不记住历史路由
                  }else{
                    that.$router.replace("/")
                  }
                },1000)
            })
            .catch(function (error) {
                that.$message.error('账号或密码错误！');
            });
          } else return false ;
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  #Login{
    width:100%;
    height: 100%;
    font-size: 14px;
    background: url(../assets/background.jpg) no-repeat;
    background-size: cover;
    display: flex;
    .content{
      width: 600px;
      height: 300px;
      margin: auto;
      box-sizing: border-box;
      background-color: #D8ECF5;
      border-radius: 4px;
      box-shadow:0px 0px 10px 8px #4B91E4;
      display: flex;
      justify-content: space-between;
      .content_left,.content_right{
        width: 49%;
        height: 100%;
        box-sizing: border-box;
        padding: 30px 20px;
      }
      .content_left{
        text-align: center;
        div{
          margin: 0 auto;
          width:140px;
          height:140px;
          border-radius: 50%;
          background-color: white;
          overflow: hidden;
        }
        h2{
          color:#009688;
        }
        p{
          margin-top: 10px;
          color:#9E9E9E;
        }
      }
      .content_mid{
        width: 2px;
        height: 100%;
        background:radial-gradient(#2CA466,#ffffff)
      }
      .content_right{
        display: flex;
        .el-form.demo-ruleForm{
          width:100%;
          margin:auto;
          /deep/ .el-input__inner{
              padding-left: 26px !important;
          }
          .Ficon{
            position: relative;
            .icon{position: absolute;left: 5px;top: 10px;font-size: 20px;color: #67C23A;}
          }
          .submi{width: 100%;background-color: #67C23A;color: white;border-color:#67C23A;}
          .el-form-item.el-form-item--feedback{
            &:nth-child(1){
              margin-top: 20px;
            }
            &:nth-child(2){
              margin-bottom: 10px;
            }
          }
          .el-checkbox-group{height: 30px;}
        }


      }
    }
  }
  @media(max-width: 600px){
    #Login{
      background: url();
      overflow: hidden;
      .content{
        width: 100%;
        height: 100vh;
        margin: auto;
        border-radius: 0px;
        box-shadow:0px 0px 0px 0px #4B91E4;
        display: block;
        .content_left,.content_right{
          width: 100%;
          height: 50%;
          box-sizing: border-box;
          padding: 30px 20px;
        }
        .content_left{
          padding: 30px 20px 0px;
          text-align: center;
        }
        .content_mid{
          width: 100%;
          height: 2px;
        }
        .content_right{
          padding-top: 20px;
        }
      }
    }
  }
</style>
