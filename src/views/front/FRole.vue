<template>
  <div id="FRole">
    <el-card class="box-card">
      <div slot="header" class="clearfix">

        <el-button
          @click="ruleForm.userTypeTypeName='',selectWin=true,centerDialogVisible=true"
          style="padding: 3px 0;font-size:15px;"
          type="text"
        >
          <i class="el-icon-circle-plus-outline"></i>新增用户
        </el-button>

        <el-checkbox v-model="checked">备选项</el-checkbox>

      </div>
      <div class="text item">
        <el-table :data="tableData" height="calc(100vh - 300px)" style="width: 100%"  row-key="date">
          <el-table-column label="#" type="index"></el-table-column>

          <el-table-column label="角色名称">
            <template slot-scope="scope">
              <span>{{ scope.row.userTypeTypeName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                :disabled="scope.row.disable"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </el-card>

    <el-dialog
      @close="close('ruleForm')"
      :title="selectWin?'新增班级信息':'修改班级信息'"
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
        <el-form-item label="角色名称" prop="userTypeTypeName">
          <el-input v-model="ruleForm.userTypeTypeName"></el-input>
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
import Api from "@/http/FRole";
import Sortable from 'sortablejs'
export default {
  data() {
    return {
      checked:true,

      tableData: [], // 显示的用户数据
      allData:[],
      selectWin: true, // 控制添加和修改
      centerDialogVisible: false, // 控制新增弹框
      ruleForm: {
        userTypeTypeName: "", // 角色名称
      },
      rules: { // 弹框验证
        userTypeTypeName: [
          { required: true, message: "输入角色名称", trigger: "blur" }
        ]
      },
      selectData: {}, // 修改时需要用到的所有数据
      selectIndex: 0, // 修改时需要时用的下标


    };
  },
  created() {
    Api.GetUserRoles().then(res=>{
      this.tableData = res.data
      this.allData = res.data
      console.log(res.data)

    })

  },
  mounted() {
    document.body.ondrop = function (event) {
             event.preventDefault();
             event.stopPropagation();
    };
    this.rowDrop()

  },
  methods: {
    handleEdit(index, row) {
      // 编辑
      this.selectWin = false; // 改为编辑框
      this.centerDialogVisible = true; // 显示弹框
      this.ruleForm.userTypeTypeName = row.userTypeTypeName;
      this.selectData = row; // 将要编辑的所有数据传给 selectData 在修改时引用
      this.selectIndex = index; // 将要编辑的下标传给 selectIndex 在修改时引用
    },
    handleDelete(index, row) {
      // 删除
      this.$confirm("此操作将永久删除该班级, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        Api.RemoveUserRole(row.userTypeId).then(res=>{
          this.tableData.splice(index,1)
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    modification(formName) {
      // 修改
      /**
       * 后台修改
       */
      this.$refs[formName].validate(valid => {
        if (valid) {
          let id = this.selectData.userTypeId
          let userRoleName = this.ruleForm.userTypeTypeName
          console.log(id,userRoleName);
          Api.ModifyUserRole({id,userRoleName}).then(res=>{
            this.tableData[this.selectIndex].userTypeTypeName = userRoleName
            this.$message({message: '修改成功',type: 'success'});

          })
          this.centerDialogVisible = false;
        }
      });
    },
    addData(formName) {
      // 添加学生
      /**
       * 添加数据
       */
      this.$refs[formName].validate(valid => {
        if (valid) {
          let userRoleName = this.ruleForm.userTypeTypeName
          Api.AddUserRole(userRoleName).then(res=>{
            this.tableData.unshift({
              disable: res.data.data.disable,
              userTypeId: res.data.data.userTypeId,
              userTypeTypeName: res.data.data.userTypeTypeName
            })
            this.$message({message: '添加成功',type: 'success'});
          })
          this.centerDialogVisible = false;
        }
      });
    },
    close(formName) {
      // 关闭弹出窗口回调
      this.$refs[formName].resetFields();
    },


    //行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const that = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          console.log(newIndex, oldIndex)
          let item = that.allData[newIndex]
          let oldData = that.allData[oldIndex]
          that.allData[newIndex] = oldData
          that.allData[oldIndex] = item

          // that.allData.splice(newIndex,1,oldData)
          // that.allData.splice(oldIndex,1,newData)
          // console.log(newData)
          // console.log(oldData)
          console.log(that.allData)
        }
      })
    },




  }
};
</script>

<style lang="less">
#FRole {
  box-sizing: border-box;
  .el-checkbox__label{padding-left: 3px;}
  .el-checkbox:last-of-type{margin-left: 10px;}
  .el-card.box-card.is-always-shadow {
    width: 100%;
  }
  .el-input {
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
}
</style>