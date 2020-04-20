<template>
  <div id="FClass">
    <el-container>
      <el-header style="height: 50px;">
        <span
          @click="ruleForm.className = '',ruleForm.courseName = '',ruleForm.userName = '',selectWin=true,centerDialogVisible=true"
        >
          <i class="el-icon-circle-plus-outline"></i>新增班级
        </span>
      </el-header>
      <el-main>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="#" type="index" width="50"></el-table-column>

          <el-table-column label="班级名称" min-width="100px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.className }}</span>
            </template>
          </el-table-column>

          <el-table-column label="授课老师" min-width="80px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.userName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="专业" min-width="50px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.courseName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="班级人数" min-width="80px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.classStudents }}</span>
            </template>
          </el-table-column>

          <el-table-column label="开班日期" min-width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.classCreateTime.substring(0,10)}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="150px">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" :disabled="scope.row.classStudents===0?false:true" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>

    <el-dialog :title="selectWin?'新增班级信息':'修改班级信息'" :visible.sync="centerDialogVisible" width="35%" center>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="班级名称">
          <el-input v-model="ruleForm.className"></el-input>
        </el-form-item>
        <el-form-item label="专业课程">
          <el-select v-model="ruleForm.courseName" placeholder="请选择">
            <el-option v-for="item in courses" :key="item.courseId" :label="item.courseName" :value="item.courseId" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授课老师">
          <el-select v-model="ruleForm.userName" placeholder="请选择">
            <el-option v-for="item in teachers" :key="item.userId" :label="item.userName" :value="item.userId" ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="selectWin?addData():modification()"
        >{{selectWin?'添 加':'修 改'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      selectWin: true,
      centerDialogVisible: false, // 控制新增弹框
      ruleForm: {
        /**
         * 弹出框数据
         */
        className: "", // 班级名称
        courseName: "", // 专业
        userName: "" // 授课老师
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

    this.axios
      .get("http://192.168.1.188:12/api/Class/GetAllClass")
      .then(res => {
        this.tableData = res.data;
      });
    this.axios.get("http://192.168.1.188:12/api/User/GetTeachers").then(res => {
      // 获取所有老师信息
      this.teachers = res.data;
    });
    this.axios
      .get("http://192.168.1.188:12/api/Class/GetAllCourse")
      .then(res => {
        // 获取所有老师信息
        this.courses = res.data;
      });
  },
  methods: {
    handleEdit(index, row) {
      // 编辑
      console.log(index,row)
      this.selectWin = false; // 改为编辑框
      this.centerDialogVisible = true; // 显示弹框
      this.ruleForm.className = row.className;
      this.ruleForm.courseName = row.classCourseId;
      this.ruleForm.userName = row.classTeacherId;
      this.selectData = row; // 将要编辑的所有数据传给 selectData 在修改时引用
      this.selectIndex = index; // 将要编辑的下标传给 selectIndex 在修改时引用
    },
    handleDelete(index, row) {
      // 删除
      this.$confirm("此操作将永久删除该班级, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableData.splice(index, 1);
          this.axios
            .get("http://192.168.1.188:12/api/Class/RemoveClass", {
              params: {
                classId: row.classId
              }
            })
            .then(res => {
              console.log(res);
            });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    modification() {
      // 修改

      /**
       * 后台修改
       */
      this.axios
        .post("http://192.168.1.188:12/api/Class/ModifyClass", {
          classId: this.selectData.classId, //要修改的班级主键
          className: this.ruleForm.className, //要修改的班级名称
          classCourseId: this.ruleForm.courseName, //课程编号
          classTeacherId: this.ruleForm.userName //老师编号
        })
        .then(res => {
            /**
             * 虚拟修改
             */
            let teachName = ""; // 授课老师  （临时变量）
            let courses = ""; // 专业  （临时变量）
            this.teachers.forEach(item => {
                if (item.userId === this.ruleForm.userName)
                return (teachName = item.userName);
            });
            this.courses.forEach(item => {
                if (item.courseId === this.ruleForm.courseName)
                return (courses = item.courseName);
            });
            this.tableData[this.selectIndex].className = this.ruleForm.className;
            this.tableData[this.selectIndex].courseName = courses;
            this.tableData[this.selectIndex].userName = teachName;
            this.tableData[this.selectIndex].classTeacherId = this.ruleForm.userName
            this.tableData[this.selectIndex].classCourseId = this.ruleForm.courseName
            this.$message({
                message: "修改成功",
                type: "success"
            });
        });
      this.centerDialogVisible = false;
    },
    addData() {
      /**
       * 添加数据
       */
      if (
        this.ruleForm.className &&
        this.ruleForm.courseName &&
        this.ruleForm.userName
      ) {
        this.axios.post("http://192.168.1.188:12/api/Class/AddClass", {
            className: this.ruleForm.className, //班级名称
            classTeacherId: this.ruleForm.userName, //老师编号
            classCourseId: this.ruleForm.courseName //课程编号
        }).then(res => {
            let teachName = "";
            let courses = "";
            for (let i in this.teachers) {
              if (this.teachers[i].userId === this.ruleForm.userName) {
                teachName = this.teachers[i].userName;
                break;
              }
            }
            for (let i in this.courses) {
              if (this.courses[i].courseId === this.ruleForm.courseName) {
                courses = this.courses[i].courseName;
                break;
              }
            }
            console.log(teachName,'============',courses)
            console.log(res.data.data)
            this.tableData.unshift({
              classCourseId: res.data.data.classCourseId,
              className: res.data.data.className,
              userName: teachName,
              courseName: courses,
              classStudents: res.data.data.classStudents,
              classCreateTime: res.data.data.classCreateTime.substring(0, 10),
              classTeacherId: res.data.data.classTeacherId
            });
        });
        this.centerDialogVisible = false;
      } else {
        this.$message.error("输入框不得为空");
      }
    }
  }
};
</script>

<style lang="less">
#FClass {
  box-sizing: border-box;
  .el-container.is-vertical {
    padding: 0px 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .el-header {
      line-height: 50px;
      color: #469fff;
      font-size: 17px;
      font-weight: 600;
      border-bottom: 1px solid #ebeef5;
      i {
        margin-right: 5px;
      }
      span {
        cursor: pointer;
        display: inline-block;
        height: 100%;
      }
    }
    .el-main {
      padding: 0;
    }
    .el-table--fit {
      width: 100%;
      margin-top: 15px;
      overflow: hidden;
    }
  }
  .el-select {
    width: 100%;
  }
  .el-dialog.el-dialog--center{
      min-width: 250px;
  }
}
</style>