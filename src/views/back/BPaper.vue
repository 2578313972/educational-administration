<template>
  <div id="BPaper">
    <div>
      <el-card class="box-card">
        <div class="text item">
          <el-table border :data="tableData" style="width: 100%">
            <el-table-column label="#" prop="enum" min-width="58"></el-table-column>
            <el-table-column prop="tpTitle" label="标题" width="80"></el-table-column>
            <el-table-column prop="userName" label="出卷人" width="100"></el-table-column>
            <el-table-column prop="courseName" label="课程" min-width="100"></el-table-column>
            <el-table-column label="出卷日期" min-width="100">
              <template slot-scope="scope">{{scope.row.tpDate | time }}</template>
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" @click="switchTab(scope.$index, scope.row)">详情</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 25, 50, 100, 200 ,400]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      @close="close('ruleForm')"
      title="修改试卷信息"
      :visible.sync="centerDialogVisible"
      width="35%"
      center
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="学生名称" prop="paperTitle">
          <el-input v-model="ruleForm.paperTitle"></el-input>
        </el-form-item>

        <el-form-item label="专业课程" prop="courseName">
          <SelectCourse v-model="comCourse" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modification('ruleForm')">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Api from "@/http/BPaper";
import SelectCourse from "@/components/selectionBox/SelectCourse";

import TimeOut from "@/plug-in/TimeOut";
export default {
  data() {
    return {
      tableData: [],
      centerDialogVisible: false, // 控制新增弹框
      comCourse: { courseName: "", courseId: "0" },
      ruleForm: {
        paperTitle: "",
        courseId: "",
        courseName: "" // 专业
      },
      total: 0, // 总数据
      pageIndex: 1, // 第几页
      pageSize: 10, // 每页多少数据
      rules: {
        /**弹框验证*/
        paperTitle: [
          { required: true, message: "请输入班级名称", trigger: "blur" }
        ],
        courseName: [
          { required: true, message: "请选择专业名称", trigger: "blur" }
        ]
      },
      selectData: {}, // 修改时需要用到的所有数据
      selectIndex: 0 // 修改时需要时用的下标
    };
  },
  created() {
    Api.GetAllTestPaper().then(res => {
      this.total = res.data.length; //总共多少数据
    });
    this.getPaperData(); // 拿默认值数据
  },
  watch: {
    comCourse: {
      /**监听选择专业下拉框 */
      handler: function(newVla, oldVal) {
        this.ruleForm.courseId = newVla.courseId;
        this.ruleForm.courseName = newVla.courseName;
      },
      deep: true
    }
  },
  components: {
    SelectCourse
  },
  methods: {
    /** 每页多少条数据 */
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPaperData(this.pageIndex, this.pageSize);
    },
    /** 第几页数据 */
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getPaperData(this.pageIndex, this.pageSize);
    },
    /** 调接口 */
    getPaperData(pageIndex, pageSize) {
      Api.GetTestPaperList({ pageIndex, pageSize }).then(res => {
        console.log(res.data);
        res.data.data.forEach((item, index) => {
          item.enum =
            this.pageIndex * this.pageSize + index + 1 - this.pageSize;
        });
        this.tableData = res.data.data;
      });
    },
    /** 编辑 */
    handleEdit(index, row) {
      console.log(index, row);
      this.ruleForm.paperTitle = row.tpTitle;
      this.comCourse.courseId = row.tpCourseId;
      this.comCourse.courseName = row.courseName;
      this.ruleForm.courseName = row.courseName;
      this.centerDialogVisible = true; // 显示弹框
      this.selectData = row; // 将要编辑的所有数据传给 selectData 在修改时引用
      this.selectIndex = index; // 将要编辑的下标传给 selectIndex 在修改时引用
    },
    /** 修改 */
    modification(formName) {
      if (this.ruleForm.courseId == 0) this.ruleForm.courseName = ""
      this.$refs[formName].validate(valid => {
        if (valid) {
          let tpTitle = this.ruleForm.paperTitle;
          let tpCourseId = this.ruleForm.courseId;
          if (tpCourseId == 0)
            return this.$message.error("请选择专业课程");
          Api.ModifyTestPaper({
            tpId: this.selectData.tpId, //试卷编号
            tpCourseId, //课程编号，可修改
            tpTitle //试卷标题，可修改
          }).then(res => {
            switch (res.data.code) {
              case 1:
                this.tableData[this.selectIndex].tpTitle = tpTitle;
                this.tableData[
                  this.selectIndex
                ].courseName = this.comCourse.courseName;
                this.tableData[
                  this.selectIndex
                ].tpCourseId = this.comCourse.courseId;
                this.centerDialogVisible = false; // 关闭弹框
                this.$message({ type: "success", message: res.data.message });
                break;
              default:
                this.$message({ type: "info", message: res.data.message });
            }
          });
        }
      });
    },
    /** 删除 */
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该班级, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          Api.RemoveTestPaper({
            id: row.tpId
          }).then(res => {
            console.log(res);
            switch (res.data.code) {
              case 1:
                --this.total;
                this.getPaperData(this.pageIndex, this.pageSize);
                this.$message({ type: "success", message: "删除成功!" });
                break;
              default:
                this.$message({ type: "info", message: "删除失败！" });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /** 关闭弹出窗口回调 */
    close(formName) {
      this.$refs[formName].resetFields();
    },
    switchTab(index, data) {
      this.$router.push(`/BPaperZJ?id=${data.tpId}`);
    }
  },
  filters: {
    // 过滤器
    time(val) {
      return TimeOut(val);
    }
  }
};
</script>

<style lang="less">
#BPaper {
  box-sizing: border-box;
  .el-card.box-card.is-always-shadow {
    width: 100%;
  }
  .el-dialog.el-dialog--center {
    min-width: 250px;
    .el-select {
      width: 100%;
    }
  }
  .el-table::before {
    height: 0;
  }
  .el-pagination {
    text-align: center;
  }
}
</style>