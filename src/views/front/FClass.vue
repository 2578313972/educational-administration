<template>
  <div id="FClass">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="addItem" style="padding: 3px 0;font-size:15px;"  type="text">
          <i class="el-icon-circle-plus-outline"></i>{{$t('FClass.newClass')}}
        </el-button>
      </div>
      <div class="text item">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="#" type="index" width="50"></el-table-column>

          <el-table-column :label="$t('FClass.className')" min-width="100px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.className }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('FClass.userName')" min-width="80px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.userName }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('FClass.courseName')" min-width="50px" >
            <template slot-scope="scope">
              <span>{{ scope.row.courseName }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('FClass.classStudents')" min-width="80px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.classStudents }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('FClass.classCreateTime')" min-width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.classCreateTime.substring(0,10)}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('FClass.cdom')" min-width="150px">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t('FClass.edit')}}</el-button>
              <el-button size="mini" type="danger" v-has="$store.state.userData.userUserTypeId" :disabled="scope.row.classStudents===0?false:true" @click="handleDelete(scope.$index, scope.row)">{{$t('FClass.delect')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog @close="close('ruleForm')" :title="selectWin?'新增班级信息':'修改班级信息'" :visible.sync="centerDialogVisible" width="35%" center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"  class="demo-ruleForm">
        <el-form-item :label="$t('FClass.className')" prop="className">
          <el-input v-model="ruleForm.className"></el-input>
        </el-form-item>
        <el-form-item :label="$t('FClass.course')" prop="courseName">
          <SelectCourse v-model="comCourse" />
        </el-form-item>
        <el-form-item :label="$t('FClass.userName')" prop="userName">
          <SelectTeacher v-model="comTeacher" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">{{$t('FClass.no')}}</el-button>
        <el-button
          type="primary"
          @click="selectWin?addData('ruleForm'):modification('ruleForm')"
        >{{selectWin?$t('FClass.add'):$t('FClass.xedit')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Api from '@/http/FClass'
import SelectCourse from 'select/SelectCourse'
import SelectTeacher from 'select/SelectTeacher'
export default {
  data () {
    return {
      tableData: [],
      selectWin: true, //
      centerDialogVisible: false, // 控制新增弹框
      comTeacher: { userName: '', userId: '' },
      comCourse: { courseName: '', courseId: '' },
      ruleForm: {
        /** 弹出框数据 */
        className: '', // 班级名称
        courseId: '',
        courseName: '', // 专业
        userId: '',
        userName: '' // 授课老师
      },
      rules: {
        /** 弹框验证 */
        className: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
        courseName: [{ required: true, message: '请选择专业名称', trigger: 'blur' }],
        userName: [{ required: true, message: '请选择授课老师', trigger: 'blur' }]
      },
      selectData: {}, // 修改时需要用到的所有数据
      selectIndex: 0, // 修改时需要时用的下标
      teachers: [], // 所有老师
      courses: [] // 所有专业
    }
  },
  created () {
    // console.log(this.$store.state.userData );
    // this.$store.commit("add");
    Api.GetAllClass().then(res => {
      this.tableData = res.data
    })
  },
  watch: {
    comTeacher: {
      /** 监听选择老师下拉框 */
      handler: function (newVla, oldVal) {
        this.ruleForm.userId = this.comTeacher.userId
        this.ruleForm.userName = this.comTeacher.userName
      },
      deep: true
    },
    comCourse: {
      /** 监听选择专业下拉框 */
      handler: function (newVla, oldVal) {
        this.ruleForm.courseId = this.comCourse.courseId
        this.ruleForm.courseName = this.comCourse.courseName
      },
      deep: true
    }
  },
  components: { SelectCourse, SelectTeacher },
  methods: {
    addItem () {
      this.selectWin = true
      this.centerDialogVisible = true

      this.ruleForm.className = ''
      this.comTeacher = {
        userName: '',
        userId: '0'
      }
      this.comCourse = {
        courseName: '',
        courseId: '0'
      }
    },
    addData (formName) { // 添加
      /**
       * 添加班级数据
       */
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const className = this.ruleForm.className
          const teacherName = this.ruleForm.userName
          const courseName = this.ruleForm.courseName
          Api.AddClass({
            className: className, // 班级名称
            classTeacherId: this.ruleForm.userId, // 老师编号
            classCourseId: this.ruleForm.courseId // 课程编号
          }).then(res => {
            switch (res.data.code) {
              case 1:
                this.tableData.unshift({
                  classCourseId: res.data.data.classCourseId,
                  className: className,
                  userName: teacherName,
                  classId: res.data.data.classId,
                  courseName: courseName,
                  classStudents: res.data.data.classStudents,
                  classCreateTime: res.data.data.classCreateTime.substring(0, 10),
                  classTeacherId: res.data.data.classTeacherId
                })
                this.$message({ message: res.data.message, type: 'success' })
                break
              default:
                this.$message.error(res.data.message)
                break
            }
          })
          this.centerDialogVisible = false
        }
      })
    },
    handleEdit (index, row) { // 编辑
      this.selectWin = false // 改为编辑框
      this.centerDialogVisible = true // 显示弹框

      this.comCourse = {
        courseId: row.classCourseId,
        courseName: row.courseName
      }
      this.comTeacher = {
        userId: row.classTeacherId,
        userName: row.userName
      }

      this.ruleForm.className = row.className
      this.ruleForm.courseId = row.classCourseId
      this.ruleForm.userId = row.classTeacherId
      console.log(this.ruleForm)

      //   className: "", // 班级名称
      //   courseId:"",
      //   courseName: "", // 专业
      //   userId:"",
      //   userName: "" // 授课老师
      console.log(row)

      this.selectData = row // 将要编辑的所有数据传给 selectData 在修改时引用
      this.selectIndex = index // 将要编辑的下标传给 selectIndex 在修改时引用
    },
    modification (formName) { // 修改
      /**
       * 后台修改
       */
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const classId = this.selectData.classId
          const className = this.ruleForm.className
          const classTeacherId = this.comTeacher.userId
          const classCourseId = this.comCourse.courseId
          Api.ModifyClass({
            classId, // 要修改的班级主键
            className, // 要修改的班级名称
            classCourseId, // 课程编号
            classTeacherId // 老师编号
          }).then(res => {
            switch (res.data.code) {
              case 1:{
              /** 虚拟修改 */
                const teachName = this.comTeacher.userName // 授课老师
                const courses = this.comCourse.courseName // 专业  （临时变量）
                const item = this.tableData[this.selectIndex]
                item.className = className
                item.courseName = courses
                item.userName = teachName
                item.classTeacherId = this.comTeacher.userId
                item.classCourseId = this.comCourse.courseId
                this.$message({ message: res.data.message, type: 'success' })
                break}
              default:{
                this.$message({ message: res.data.message, type: 'warning' })
                break}
            }
          })
          this.centerDialogVisible = false
        }
      })
    },
    handleDelete (index, row) { // 删除
      this.$confirm(this.$t('FClass.yun'), this.$t('FClass.Tips'), {
        confirmButtonText: this.$t('FClass.determine'),
        cancelButtonText: this.$t('FClass.cancel'),
        type: 'warning'
      }).then(() => {
        Api.RemoveClass({
          classId: row.classId
        }).then(res => {
          if (res.data.code === 1) {
            this.tableData.splice(index, 1)
            this.$message({
              type: 'success',
              message: res.data.message
            })
          } else {
            this.$message({
              type: 'info',
              message: res.data.message
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('FClass.cancel1')
        })
      })
    },

    close (formName) { // 关闭弹出窗口回调
      this.$refs[formName].resetFields()
    },
    arrFindTeacher (arr, val) { // 查找老师名称
      return arr.find(item => item.userId === val)
    },
    arrFindCourses (arr, val) { // 查找专业名称
      return arr.find(item => item.courseId === val)
    }
  },
  filters: {
    time () {

    }
  }
}
</script>

<style lang="less" scoped>
#FClass {
  box-sizing: border-box;
  .el-card.box-card.is-always-shadow{
    width:100%;
  }
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
