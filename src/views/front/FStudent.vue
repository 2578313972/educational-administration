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
                <el-table :data="tableData" height="calc(100vh - 250px)" style="width: 100%">
                <el-table-column label="#" type="index" width="50"></el-table-column>

                <el-table-column label="班级名称" min-width="100px">
                    <template slot-scope="scope">
                    <span>{{ scope.row.className }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="学生姓名" min-width="100px">
                    <template slot-scope="scope">
                    <span>{{ scope.row.stuName }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="性别" min-width="80px">
                    <template slot-scope="scope">
                    <span>{{ scope.row.stuSex }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="手机号" min-width="50px" >
                    <template slot-scope="scope">
                    <span>{{ scope.row.stuMobile }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="出生日期" min-width="80px">
                    <template slot-scope="scope">
                    <span>{{ scope.row.stuBirthDay }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="年龄" min-width="100px">
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
import Api from '@/http/FClass'
import Api1 from '@/http/FStudent'
export default {
  data() {
     var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
    return {
      formInline: {
        classId: ''
      },
      allClass:[],
      formInlineRules:{
         classId: [
            { message: '请输入班级名称', trigger: 'change' }
          ],
      },


      tableData: [],
      selectWin: true, //
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
        stuMobile:[{ validator:checkAge, message: '请输入手机号', trigger: 'blur' }], //手机号验证
        stuSex:[{ required: true, message: '请选择性别', trigger: 'blur' }], //性别验证
        stuPassword:[{ required: true, message: '请输入密码', trigger: 'blur' }]  // 密码验证
      },
      selectData: {}, // 修改时需要用到的所有数据
      selectIndex: 0, // 修改时需要时用的下标
      teachers: [], // 所有老师
      courses: [] // 所有专业
    };
  },
  created() {
    // this.axios.get('/mock/FClass').then(res => {
    //     this.tableData = res.data
    // })
    Api1.GetAllClass().then(res => {
      this.allClass = res.data
      console.log(this.allClass)
    })

  },
  watch:{
    formInline:{
      handler:function(){
        // console.log(this.formInline.classId)
        Api1.GetClassStudent({classId:this.formInline.classId}).then(res=>{
          console.log(res)
          this.tableData = res.data
        })
      },
      deep:true
    },
    ruleForm:{
      handler:function(){
        console.log(this.ruleForm)
      },
      deep:true
    }
  },
  methods: {
    handleEdit(index, row) { // 编辑
      this.selectWin = false; // 改为编辑框
      this.centerDialogVisible = true; // 显示弹框
      // this.ruleForm.className = row.className;
      // this.ruleForm.courseName = row.classCourseId;
      // this.ruleForm.userName = row.classTeacherId;
      this.selectData = row; // 将要编辑的所有数据传给 selectData 在修改时引用
      this.selectIndex = index; // 将要编辑的下标传给 selectIndex 在修改时引用
    },
    handleDelete(index, row) { // 删除
      this.$confirm("此操作将永久删除该班级, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {

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
          stuSex===1?stuSex="男":stuSex="女"
          console.log(stuName)
          console.log(stuClassId)
          console.log(stuBirthDay)
          console.log(stuMobile)
          console.log(stuPassword)
          console.log(stuSex)
          Api1.AddStudent({
            stuName,  //学生姓名
            stuClassId,  //班级编号
            stuBirthDay,  //生日
            stuMobile,  //手机号
            stuPassword,  //登录密码,
            stuSex  //性别
          }).then(res => {
            this.$message({message: '添加成功',type: 'success'});
            console.log(res)

          });
          this.centerDialogVisible = false;
        }
      })
    },
    close(formName){ // 关闭弹出窗口回调
      this.$refs[formName].resetFields();
    },
    arrFindTeacher(arr,val){ // 查找老师名称
      return arr.find(item=>item.userId===val)
    },
    arrFindCourses(arr,val){ // 查找专业名称
      return arr.find(item=>item.courseId===val)
    }
  },
  filters:{
    time(){

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
