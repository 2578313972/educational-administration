<template>
    <div id="FPassword">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <i class="el-icon-edit"></i>修改密码
            </div>
            <div class="text item">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="旧密码" prop="oldPassword">
                        <el-input v-model.number="ruleForm.oldPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="pass">
                        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>


    </div>
</template>

<script>
import Api from "@/http/FPassword"
export default {
    data() {
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('旧密码不能为空'));
        }
        callback()
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          pass: '',
          checkPass: '',
          oldPassword: ''
        },
        rules: {
          pass: [
            {  required: true,validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            {  required: true,validator: validatePass2, trigger: 'blur' }
          ],
          oldPassword: [
            {  required: true,validator: checkAge, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        let userName = JSON.parse(this.Base64.decode(this.Cookie.getCookie("userInfo"))).userMobile // 账号
        this.$refs[formName].validate((valid) => {
          if (valid) {
            Api.ModifyPassword({
                uid:JSON.parse(sessionStorage.getItem('userData')).userUid,
                oldPassword:this.ruleForm.oldPassword,
                newPassword:this.ruleForm.pass
            }).then(res=>{
                console.log(res)
                switch (res.data.code){
                  case 1:
                    this.$message({message: '密码修改成功',type: 'success'});
                    break;
                  default:
                    this.$message.error('密码修改失败');
                }

            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style lang="less">

</style>