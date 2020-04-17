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
                      <el-form-item class="Ficon" prop="userName">
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
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号！'));
        } else {
          let a = /^\w{4,16}$/
          if(!a.test(value)) callback(new Error('账号长度 4-16'));
          setTimeout(callback,500)
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码！'));
        } else{
          let a = /^\w{4,16}$/
          if(!a.test(value)) callback(new Error('密码长度 4-16'));
          setTimeout(callback,500)
        }
      };
      return {
        ruleForm: {
          userName: '',
          userPassword: '',
          type:[]
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
    methods: {
      submitForm(formName) {
this.axios.get('https://baidu.com').then(function(res){
                console.log(res)
            }).catch(function (error) {
                console.log(error);
            });
        let that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            
          } else return false
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
        // background-color: chartreuse;
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
</style>
