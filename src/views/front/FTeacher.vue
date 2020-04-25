<template>
    <div id="FTeacher">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-button @click="ruleForm.userTypeTypeName='',ruleForm.userName='',ruleForm.userMobile='',ruleForm.userSex='男',ruleForm.userPassword='',selectWin=true,centerDialogVisible=true" style="padding: 3px 0;font-size:15px;"  type="text">
                    <i class="el-icon-circle-plus-outline"></i>新增用户
                </el-button>
                <el-radio-group v-model="radio">
                    <el-radio label="全部">全部</el-radio>
                    <el-radio v-for="item in allUser" :key="item.userTypeId" :label="item.userTypeTypeName">{{item.userTypeTypeName}}</el-radio>
                </el-radio-group>
            </div>
            <div class="text item">
                <el-table :data="tableData" height="calc(100vh - 300px)" style="width: 100%">

                    <el-table-column label="#" type="index" width="50"></el-table-column>

                    <el-table-column label="用户名称" min-width="100px">
                        <template slot-scope="scope">
                        <span>{{ scope.row.userName }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="手机号" min-width="100px">
                        <template slot-scope="scope">
                        <span>{{ scope.row.userMobile }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="密码" min-width="80px">
                        <template slot-scope="scope">
                        <span>{{ scope.row.userPassword }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="性别" min-width="50px" >
                        <template slot-scope="scope">
                        <span>{{ scope.row.userSex }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="角色名称" min-width="100px">
                        <template slot-scope="scope">
                        <span>{{ scope.row.userTypeTypeName}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" min-width="150px">
                        <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" :disabled='scope.row.disableDelete?true:false' type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>

        <el-dialog @close="close('ruleForm')" :title="selectWin?'新增班级信息':'修改班级信息'" :visible.sync="centerDialogVisible" width="35%" center>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"  class="demo-ruleForm">

                <el-form-item label="用户名称" prop="userName">
                  <el-input v-model="ruleForm.userName"></el-input>
                </el-form-item>

                <el-form-item label="手机号" prop="userMobile">
                  <el-input v-model="ruleForm.userMobile"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="userPassword">
                  <el-input type="password" v-model="ruleForm.userPassword"></el-input>
                </el-form-item>

                <el-form-item label="性别" prop="userSex">
                  <el-radio v-model="ruleForm.userSex" label="男">男</el-radio>
                  <el-radio v-model="ruleForm.userSex" label="女">女</el-radio>
                </el-form-item>

                <el-form-item label="角色" prop="userTypeTypeName">
                  <el-select v-model="ruleForm.userTypeTypeName" placeholder="请选择">
                      <el-option v-for="item in allUser" :key="item.userTypeId" :label="item.userTypeTypeName" :value="item.userTypeId"></el-option>
                  </el-select>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button
                type="primary"
                @click="selectWin?addData('ruleForm'):modification('ruleForm')"
                >{{selectWin?'添 加':'修 改'}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Api from '@/http/FTeacher'
export default {
  data() {
     var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入手机号码'));
        }
        setTimeout(() => {
          if(!(/^1\d{10}$/.test(value))){
              callback(new Error('手机号码格式有误，请重填'));
          } else{
            callback();
          }
        }, 500);
      };
      var password = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入密码'));
        }
        if(!(/\w{6,}/.test(value))){
            callback(new Error('密码长度为6~12'));
        } else{
            callback();
        }
      };
    return {
        radio:"全部",
        allUser:[], // 所有角色
        allData:[], // 所有老师数据
        tableData: [], // 显示的老师数据
        selectWin: true, // 控制添加和修改
        centerDialogVisible: false, // 控制新增弹框
        ruleForm: {
            /**
             * 弹出框数据
             */
            userTypeTypeName: "", // 角色
            userName: "", // 用户名称
            userMobile:"",//手机号
            userSex:"男",//性别
            userPassword:"", // 密码
        },
        rules:{
            /**
             * 弹框验证
             */
            userTypeTypeName:[{ required: true, message: '请选择班级名称', trigger: 'blur' }],  // 班级名称验证
            userName:[{ required: true, message: '请输入学生姓名', trigger: 'blur' }],  // 学生姓名验证
            stuBirthDay:[{ required: true, message: '请选择生日时间', trigger: 'blur' }],  // 生日验证
            userMobile:[{ validator:checkAge,trigger: 'blur' }], //手机号验证
            userSex:[{ required: true, message: '请选择性别', trigger: 'blur' }], //性别验证
            userPassword:[{ validator:password, trigger: 'blur' }]  // 密码验证
        },
        selectData: {}, // 修改时需要用到的所有数据
        selectIndex: 0, // 修改时需要时用的下标
    };
  },
  created() {
      Api.GetUserRoles().then(res=>{
          this.allUser = res.data
      })
      Api.GetTeachers().then(res=>{
          this.tableData = res.data
          this.allData = res.data
          console.log(res)
      })
  },
  watch:{
    radio(newVal,oldVal){
        if(newVal==="全部") return this.tableData = this.allData
        this.tableData = this.allData.filter(item=> item.userTypeTypeName===this.radio)
    }
  },
  methods: {
    handleEdit(index, row) { // 编辑
      this.selectWin = false; // 改为编辑框
      this.centerDialogVisible = true; // 显示弹框
      console.log(row)
      this.ruleForm.userTypeTypeName = row.userUserTypeId
      this.ruleForm.userName = row.userName
      this.ruleForm.userMobile = row.userMobile
      this.ruleForm.userSex = row.userSex
      this.ruleForm.userPassword = row.userPassword

      this.selectData = row; // 将要编辑的所有数据传给 selectData 在修改时引用
      this.selectIndex = index; // 将要编辑的下标传给 selectIndex 在修改时引用
    },
    handleDelete(index, row) { // 删除
      console.log(row)
      this.$confirm("此操作将永久删除该班级, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          Api.RemoveTeacher(row.userUid).then(res=>{
            for (let i in this.allData) {
                if(this.allData[i] === row){
                    this.allData.splice(i,1)
                    break
                }
            }
            this.tableData.splice(index,1)
            this.$message({message: '删除成功',type: 'success'});
          })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    modification(formName) {// 修改
      /**
       * 后台修改
       */
      this.$refs[formName].validate((valid) => {
        if (valid) {
            let userUid = this.selectData.userUid
            let userName = this.ruleForm.userName
            let userMobile = this.ruleForm.userMobile
            let userSex = this.ruleForm.userSex
            let userUserTypeId = this.ruleForm.userTypeTypeName
            let userPassword = this.ruleForm.userPassword
            Api.ModifyTeacher({
                userUid, //要修改的用户标识符
                userName, //修改名称
                userMobile, //要修改的手机号，11位手机号
                userSex, //要修改的性别，男|女
                userUserTypeId, //角色
                userPassword //密码
            }).then(res=>{
                let allIndex = this.arrIndex(this.allData,this.selectData)
                //   console.log(this.allData[allIndex].userName)



                // if( this.radio!=="全部" && this.arrFind(this.allData,'userUserTypeId',userUserTypeId).userTypeTypeName !== this.radio){
                  //  this.tableData.splice(this.selectIndex,1)
                  //  console.log('TypeId')
                // }else{
                  // console.log('Nowary')
                  // console.log(this.arrFind(this.allData,'userUserTypeId',this.ruleForm.userTypeTypeName).userTypeTypeName)
                  // console.log(this.arrFind(this.allData,'userUserTypeId',userUserTypeId).userTypeTypeName);

                  let item = this.tableData[this.selectIndex];
                  item.userUid = userUid;
                  item.userName = userName;
                  item.userMobile = userMobile;
                  item.userSex = userSex;
                  item.userUserTypeId = userUserTypeId;
                  item.userPassword = userPassword;
                  item.userTypeTypeName = this.arrFind(this.allData,'userUserTypeId',userUserTypeId).userTypeTypeName;
                  console.log(this.allData[allIndex].userName,)

                  if( this.radio!=="全部" && this.arrFind(this.allData,'userUserTypeId',userUserTypeId).userTypeTypeName !== this.radio){
                    this.tableData.splice(this.selectIndex,1)
                  }




                this.$message({message: '修改成功',type: 'success'});
            });
            this.centerDialogVisible = false;
        }
      })
    },
    addData(formName) { // 添加学生
      /**
       * 添加数据
       */
      this.$refs[formName].validate((valid) => {
        if (valid) {
            let userName = this.ruleForm.userName
            let userMobile = this.ruleForm.userMobile
            let userSex = this.ruleForm.userSex
            let userPassword = this.ruleForm.userPassword
            let userUserTypeId = this.ruleForm.userTypeTypeName
            Api.AddTeacher({
                userName, //用户名，不能为空
                userMobile, //手机号，长度11位
                userSex, //性别，男|女
                userPassword, //密码，长度6~18
                userUserTypeId,//用户角色编号
            }).then(res=>{
                switch (res.data.code){
                    case 1:
                        let littleData = {
                            userId: res.data.data.userId,
                            userMobile: res.data.data.userMobile,
                            userName: res.data.data.userName,
                            userPassword: res.data.data.userPassword,
                            userSex: res.data.data.userSex,
                            userUid: res.data.data.userUid,
                            userUserTypeId: res.data.data.userUserTypeId,
                            disableDelete: false,
                            userTypeTypeName: this.arrFind(this.allUser,"userTypeId",userUserTypeId).userTypeTypeName
                        }
                        let typeName = this.arrFind(this.allData,'userUserTypeId',res.data.data.userUserTypeId).userTypeTypeName
                        if(this.radio===typeName) this.tableData.push(littleData)
                        this.allData.push(littleData)// 虚拟添加到allData数组
                        this.$message({message: '添加成功',type: 'success'});
                        break;
                    default:
                        this.$message({type: "info",message: "添加失败"});
                }
            })
          this.centerDialogVisible = false;
        }
      })
    },
    close(formName){ // 关闭弹出窗口回调
      this.$refs[formName].resetFields();
    },
    arrFind(arr,property,val){ // 通过数组查找相同的目标
      return arr.find(item=>item[property]===val)
    },
    arrIndex(arr,el){ // 通过数组查找相同目标的下标
      for (let i in arr) {
        if(arr[i] === el){
          return i
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
    #FTeacher{
        box-sizing: border-box;
        .el-radio-group{
            margin-left: 10px;
            margin-top: 5px;
        }
        .clearfix{
          display: flex;
          .el-form.demo-form-inline.el-form--inline{
            display: flex;
            margin-right: 15px;
            .el-form-item{margin:auto;}
          }
        }
        .el-card.box-card.is-always-shadow{
            width:100%;
        }
        .el-input{width:100%;}
        .el-dialog.el-dialog--center{
            min-width: 250px;
            .el-select{
                width:100%;
            }
        }
        .el-table::before{
            height: 0;
        }
    }
</style>
