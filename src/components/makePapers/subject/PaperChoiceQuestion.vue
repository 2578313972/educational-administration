<template>
  <div id="PaperChoiceQuestion">
    <el-form label-width="80px" ref="paperForm" :model="paperForm">
      <el-form-item
        label="题干"
      >
        <el-input
          type="textarea"
          ref="textarea"
          autosize
          autofocus
          placeholder="请输入内容"
          v-model="paperForm.textarea"
        ></el-input>
      </el-form-item>

      <el-form-item class="enum" v-for="(item, index) in paperForm.data" :key="item.serial">
        <el-checkbox slot="label" v-model="item.tar">{{item.serial}}、</el-checkbox>
        <el-input class="paperbtn" :ref="'value'+index" v-model="item.value"></el-input>
        <el-button
          type="danger"
          icon="el-icon-delete"
          circle
          :disabled="paperForm.data.length>2?false:true"
          @click="deleteSer(index)"
        ></el-button>
      </el-form-item>

      <el-form-item label="分值">
        <el-input-number size="small" v-model="paperForm.num"></el-input-number>
      </el-form-item>

      <el-form-item class="btn">
        <el-button round @click="resetForm">重置</el-button>
        <el-button type="info" @click="addValue" round>新增选项</el-button>
        <el-button type="primary" @click="submitTitle" round>
          <span class="el-icon-document-checked"></span>保存题目
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Api from "@/http/BMakePaper";
// import save from '../../../plug-in/SaveTraffic'
export default {
  data() {
    return {
      usa: ["A", "B", "C", "D", "E", "F", "G"],
      paperForm: {
        data: [],
        textarea: "",
        num: 2
      }
    };
  },
  created() {
    this.paperForm.data = [
          { serial: "A", tar: false, value: "" },
          { serial: "B", tar: false, value: "" },
          { serial: "C", tar: false, value: "" },
          { serial: "D", tar: false, value: "" }
    ]
  },
  methods: {
    addValue() {
      /** 添加选项 */
      let serial = this.usa[this.paperForm.data.length];
      if (!serial)
        return this.$message({ type: "info", message: "已达最大上限" });
      this.paperForm.data.push({ serial, tar: false, value: "" });
    },
    deleteSer(index) {
      /** 删除选项并排序 */
      this.paperForm.data.splice(index, 1);
      for (let i = index; i < this.paperForm.data.length; i++) {
        this.paperForm.data[i].serial = this.usa[i];
      }
    },
    submitTitle() {
      /** 提交选择题 */
      let bool = true;
      let arrItem = this.paperForm.data;
      if(!this.paperForm.textarea) {
        this.$refs.textarea.focus()
        this.$message({message: `题干不能为空。请输入题目`,type: "warning"});
        return
      }
      for (let i in arrItem) {
        if(!arrItem[i].value) {
          // 查找未填写答案的输入框
          this.$refs['value'+i][0].focus()
          this.$message({message: `${this.usa[i]}选项未填写答案。请输入答案`,type: "warning"});
          return
        }
        for (let j = +i + 1, len = arrItem.length; j < len; j++) {
          // 检查答案是否重复
          if (arrItem[i].value === arrItem[j].value){
            this.$refs['value'+j][0].focus()
            return this.$message({
              message: `${this.usa[i]}选项与${this.usa[j]}选项出现重复答案,请重新填写`,
              type: "warning"
            });
          }
        }
        if (arrItem[i].tar === true) {
          // 检查是否有正确答案，如果没有则返回提示
          bool = false;
          break;
        }
      }
      if (bool) return this.$message({message: "没有选择答案,请选择",type: "warning"});
      let chooseQuestion = arrItem.map(item=>{return {cqOption: item.value, cqIsRight: item.tar}}) // map映射导入数据
      Api.AddQuestionToTestPaper({
        tpqPaperId: sessionStorage.getItem("testPaperId"), //试卷主键编号
        tpqScore: this.paperForm.num, //分值
        tpqQuestion: {
          questionTitle: this.paperForm.textarea, //题目的标题
          questionTypeId: 1, //题目的类型 1=选择题 2=填空题 3=问答题
          chooseQuestion
        }
      }).then(res => {
        console.log(res);
        switch (res.data.code) {
          case 1:
            this.resetForm(); // 调用重置表单函数
            this.$message({ message: res.data.message, type: "success" });
            break;
          default:
            this.$message({ message: res.data.message, type: "warning" });
        }
      });
    },
    resetForm() {
      /** 重置表单 */
      this.paperForm = {
        data: [
          { serial: "A", tar: false, value: "" },
          { serial: "B", tar: false, value: "" },
          { serial: "C", tar: false, value: "" },
          { serial: "D", tar: false, value: "" }
        ],
        textarea: "",
        num: 2
      };
      this.$refs["paperForm"].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
#PaperChoiceQuestion {
  .btn {
    margin-top: 15px;
  }
  .el-input {
    width: calc(100% - 60px);
    margin-right: 12.5px;
  }
  .el-form-item__content .el-button.is-round {
    padding: 7px 15px;
  }
}
</style>