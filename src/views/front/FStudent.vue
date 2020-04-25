<template>
    <div id="FStudent">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <!-- <span>卡片名称</span> -->
                <el-form :inline="true" :rules="formInlineRules" :model="formInline" class="demo-form-inline">
                  <el-form-item>
                    <el-select v-model="formInline.classId" placeholder="班级选择">
                      <el-option v-for="item in allClass" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <el-button @click="selectWin=true,centerDialogVisible=true" style="padding: 3px 0;font-size:15px;"  type="text">
                <i class="el-icon-circle-plus-outline"></i>新增学生
                </el-button>
            </div>
            <div class="text item">
                <el-table :data="tableData" height="calc(100vh - 300px)" style="width: 100%">
                <el-table-column label="#" type="index" width="50"></el-table-column>

                <el-table-column label="班级名称" min-width="70px">
                    <template slot-scope="scope">
                    <span>{{ scope.row.className }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="学生姓名" min-width="80px">
                    <template slot-scope="scope">
                    <span>{{ scope.row.stuName }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="性别" min-width="45px">
                    <template slot-scope="scope">
                    <span>{{ scope.row.stuSex }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="手机号" min-width="120px" >
                    <template slot-scope="scope">
                    <span>{{ scope.row.stuMobile }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="出生日期" min-width="80px">
                    <template slot-scope="scope">
                    <span>{{ scope.row.stuBirthDay | time }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="年龄" min-width="45px">
                    <template slot-scope="scope">
                    <span>{{ scope.row.stuAge}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" min-width="150px">
                    <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                </el-table>
            </div>
        </el-card>

        <el-dialog @close="close('ruleForm')" :title="selectWin?'新增班级信息':'修改班级信息'" :visible.sync="centerDialogVisible" width="35%" center>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"  class="demo-ruleForm">
                <el-form-item label="班级" prop="className">
                  <el-select v-model="ruleForm.className" placeholder="请选择">
                      <el-option v-for="item in allClass" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="学生名称" prop="stuName">
                  <el-input v-model="ruleForm.stuName"></el-input>
                </el-form-item>

                <el-form-item label="生日" prop="stuBirthDay">
                      <el-date-picker v-model="ruleForm.stuBirthDay" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>

                <el-form-item label="手机号" prop="stuMobile">
                  <el-input v-model="ruleForm.stuMobile"></el-input>
                </el-form-item>

                <el-form-item label="性别" prop="stuSex">
                  <el-radio v-model="ruleForm.stuSex" label="1">男</el-radio>
                  <el-radio v-model="ruleForm.stuSex" label="2">女</el-radio>
                </el-form-item>

                <el-form-item label="密码" prop="stuPassword">
                  <el-input type="password" v-model="ruleForm.stuPassword"></el-input>
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
import Api from '@/http/FStudent'
import TimeOut from '@/plug-in/TimeOut'
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
    return {
      formInline: {
        classId: '' // 被选中的班级名称
      },
      allClass:[],
      formInlineRules:{
         classId: [
            { message: '请输入班级名称', trigger: 'change' }
          ],
      },

      tableData: [], // 显示的班级数据
      selectWin: true, // 控制添加和修改
      centerDialogVisible: false, // 控制新增弹框
      ruleForm: {
        /**
         * 弹出框数据
         */
        className: "", // 班级名称
        stuName: "", // 学生姓名
        stuBirthDay:"", // 生日
        stuMobile:"",//手机号
        stuSex:"",//性别
        stuPassword:"", // 密码
      },
      rules:{
        /**
         * 弹框验证
         */
        className:[{ required: true, message: '请选择班级名称', trigger: 'blur' }],  // 班级名称验证
        stuName:[{ required: true, message: '请输入学生姓名', trigger: 'blur' }],  // 学生姓名验证
        stuBirthDay:[{ required: true, message: '请选择生日时间', trigger: 'blur' }],  // 生日验证
        stuMobile:[{ validator:checkAge,trigger: 'blur' }], //手机号验证
        stuSex:[{ required: true, message: '请选择性别', trigger: 'blur' }], //性别验证
        stuPassword:[{ required: true, message: '请输入密码', trigger: 'blur' }]  // 密码验证
      },
      selectData: {}, // 修改时需要用到的所有数据
      selectIndex: 0, // 修改时需要时用的下标
    };
  },
  created() {
    Api.GetAllClass().then(res => {
      this.allClass = res.data
      console.log(this.allClass)
    })
  },
  watch:{
    formInline:{
      handler:function(){
        Api.GetClassStudent({classId:this.formInline.classId}).then(res=>{
          this.tableData = res.data
          this.classId = this.formInline.classId
        })
      },
      deep:true
    }
  },
  methods: {
    handleEdit(index, row) { // 编辑
      console.log(index,row);
      this.selectWin = false; // 改为编辑框
      this.centerDialogVisible = true; // 显示弹框

      this.ruleForm.className = row.className
      this.ruleForm.stuName = row.stuName
      this.ruleForm.stuBirthDay = row.stuBirthDay
      this.ruleForm.stuMobile = row.stuMobile
      this.ruleForm.stuSex = row.stuSex
      this.ruleForm.stuSex=="男"?this.ruleForm.stuSex='1':this.ruleForm.stuSex='2'
      this.ruleForm.stuPassword = row.stuPassword

      this.selectData = row; // 将要编辑的所有数据传给 selectData 在修改时引用
      this.selectIndex = index; // 将要编辑的下标传给 selectIndex 在修改时引用
    },
    handleDelete(index, row) { // 删除
      this.$confirm("此操作将永久删除该班级, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        Api.RemoveStudent({uid:row.stuUid}).then(res=>{
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
          let stuName = this.ruleForm.stuName // 学生姓名
          let stuClassId = this.arrFindClass(this.allClass,this.ruleForm.className).classId // 班级编号
          let stuBirthDay = this.ruleForm.stuBirthDay // 生日
          let stuMobile = this.ruleForm.stuMobile // 手机号
          let stuPassword = this.ruleForm.stuPassword // 密码
          let stuSex = this.ruleForm.stuSex // 性别
          stuSex==1?stuSex="男":stuSex="女"
          Api.ModifyStudent({
            stuUid:this.selectData.stuUid,// 要修改学生的唯一标识符
            stuName,//要修改的名称
            stuBirthDay,//要修改的生日
            stuClassId,//班级编号
            stuMobile,//要修改的手机号
            stuPassword,//要修改的密码
            stuSex,//要修改的性别
          }).then(res=>{
            console.log(res)
            switch (res.data.code) {
              case 0:
                this.$message({message: '数据没有变化',type: 'warning'});
                break;
              case 1:
                this.$message({message: '修改成功',type: 'success'});
                let item = this.tableData[this.selectIndex]
                item.stuName = stuName
                item.stuBirthDay = stuBirthDay
                item.stuClassId = stuClassId
                item.stuMobile = stuMobile
                item.stuPassword = stuPassword
                item.stuSex = stuSex
                item.stuAge = res.data.data
                break;
            }

          })
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
          let stuName = this.ruleForm.stuName // 学生姓名
          let stuClassId = this.ruleForm.className // 班级名称
          let stuBirthDay = this.ruleForm.stuBirthDay // 生日
          let stuMobile = this.ruleForm.stuMobile // 手机号
          let stuPassword = this.ruleForm.stuPassword // 密码
          let stuSex = this.ruleForm.stuSex // 性别
          stuSex==1?stuSex="男":stuSex="女"
          console.log(stuName)
          console.log(stuClassId)
          console.log(stuBirthDay)
          console.log(stuMobile)
          console.log(stuPassword)
          console.log(stuSex)
          Api.AddStudent({
            stuName,  //学生姓名
            stuClassId,  //班级编号
            stuBirthDay,  //生日
            stuMobile,  //手机号
            stuPassword,  //登录密码,
            stuSex  //性别
          }).then(res => {
            console.log(res)
            if(res.data.code==1){
              console.log(this.tableData)
              if(this.formInline.classId===res.data.data.classId){
                this.tableData.push({
                  classId:2899,
                  className:res.data.data.className,
                  stuAge:res.data.data.stuAge,
                  stuBirthDay:res.data.data.stuBirthDay,
                  stuMobile:res.data.data.stuMobile,
                  stuName:res.data.data.stuName,
                  stuPassword:res.data.data.stuPassword,
                  stuSex:res.data.data.stuSex,
                  stuUid:res.data.data.stuUid,
                })
              }
              this.$message({message: '添加成功',type: 'success'});
            }

          });
          this.centerDialogVisible = false;
        }
      })
    },
    close(formName){ // 关闭弹出窗口回调
      this.$refs[formName].resetFields();
    },
    arrFindClass(arr,val){ // 查找班级编号
      return arr.find(item=>item.className===val)
    },
  },
  filters:{ // 过滤器
    time(val){
      return TimeOut(val)
    }
  }
};
</script>

<style lang="less" scoped>
    #FStudent{
        box-sizing: border-box;
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
