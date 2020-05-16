<template>
  <div id="ModifyChoice">
    <div class="box">
      <el-form label-width="150px" v-if="!balBool" ref="paperForm" :model="choiceData">
        <el-form-item :label="'第'+(index+1)+'题、'">
          {{choiceData.tpqQuestion.questionTitle}}
          <el-input-number
            v-model="choiceData.tpqScore"
            @change="handleChange"
            size="mini"
            :min="1"
            :max="10"
            label="描述文字"
          ></el-input-number>
        </el-form-item>

        <el-form-item v-for="(qusetion,ind) in choiceData.tpqQuestion.chooseQuestion" :key="ind">
          <el-checkbox slot="label" disabled v-model="qusetion.cqIsRight">{{usa[ind]}}、</el-checkbox>
          <span>{{qusetion.cqOption}}</span>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" @click="switchBox(index)" round>编辑</el-button>
        </el-form-item>
      </el-form>

      <el-form label-width="150px" v-else ref="paperForm" :model="choiceData">
        <el-form-item :label="(index+1)+'、 题干'">
          <el-input
            type="textarea"
            ref="textarea"
            autosize
            autofocus
            placeholder="请输入内容"
            v-model="choiceData.tpqQuestion.questionTitle"
          ></el-input>
        </el-form-item>

        <el-form-item
          class="enum"
          v-for="(qusetion,ind) in choiceData.tpqQuestion.chooseQuestion"
          :key="ind"
        >
          <el-checkbox slot="label" v-model="qusetion.cqIsRight">{{usa[ind]}}、</el-checkbox>
          <el-input class="paperbtn" :ref="'value'+ind" v-model="qusetion.cqOption"></el-input>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            :disabled="choiceData.tpqQuestion.chooseQuestion.length>2?false:true"
            @click="deleteSer(ind)"
          ></el-button>
        </el-form-item>

        <el-form-item class="btn">
          <el-button size="mini" disabled type="primary" round>编辑</el-button>
          <el-button size="mini" type="primary" @click="switchBoxElse" round>取消</el-button>
          <el-button size="mini" :disabled="choiceData.tpqQuestion.chooseQuestion.length<usa.length?false:true" @click="addValue" round>新增选项</el-button>
          <el-button size="mini" type="primary" @click="submitTitle" round>保存修改</el-button>
          <el-button size="mini" type="danger" @click="deleteQuestion" round>删除题目</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Api from "@/http/BMakePaper";

export default {
  data() {
    return {
      usa: ["A", "B", "C", "D", "E", "F", "G"],
      choiceData: {},
      choiceDataClone: {},
      balBool: false
    };
  },
  props: {
    item:Object,
    index:Number
  },
  created() {
    this.choiceData = JSON.parse(JSON.stringify(this.item))
    this.choiceDataClone = JSON.parse(JSON.stringify(this.item))
  },
  methods: {
    /** 切换布局事件 */
    switchBox() {
      this.balBool = !this.balBool
    },
    /** 点击取消 */
    switchBoxElse() {
      this.choiceData = JSON.parse(JSON.stringify(this.choiceDataClone))
      this.switchBox()
    },
    /** 修改分数 */
    handleChange() {
      Api.ModifyScore({
        tpqId: this.choiceData.tpqId, //主键编号
        tpqScore: this.choiceData.tpqScore //要修改的分值
      }).then(res => {
        switch (res.data.code) {
          case 1:
            this.$emit("handleChange",this.choiceData.tpqId,this.choiceData.tpqScore);
            this.$message({ message: res.data.message, type: "success" });
            break;
          default:
            this.$message({ message: res.data.message, type: "warning" });
        }
      });
    },
    /** 添加选项 */
    addValue() {
      this.choiceData.tpqQuestion.chooseQuestion.push({
        cqIsRight: false,
        cqOption: ""
      });
    },
    /** 删除行 */
    deleteSer(index) {
      this.choiceData.tpqQuestion.chooseQuestion.splice(index, 1); // 删除选项
    },
    /** 删除题目 */
    deleteQuestion() {
      Api.RemoveQuestionFromTestPaper({ paperQuestionId: this.choiceData.tpqId }).then(
        res => {
          switch (res.data.code) {
            case 1:
              this.$emit("deleteQuestion", this.choiceData.tpqId );
              this.$message({ message: res.data.message, type: "success" });
              break;
            default:
              this.$message({ message: res.data.message, type: "warning" });
          }
        }
      );
    },
    /** 保存修改 */
    submitTitle() {
      if (this.choiceData.tpqQuestion.questionTitle.trim() === "") {
        this.$message({ message: "题干不能为空", type: "warning" });
        return this.$refs.textarea[0].focus();
      }
      let bool = true;
      let againObj = {};
      let arrItem = this.choiceData.tpqQuestion.chooseQuestion;
      let len = arrItem.length;
      for (let i = 0; i < len; i++) {
        if (arrItem[i].cqOption.trim() === "") {
          // 查找未填写答案的输入框
          this.$refs["value" + i][0].focus();
          this.$message({
            message: `${this.usa[i]}选项未填写答案。请输入答案`,
            type: "warning"
          });
          return;
        }
        // 去重
        if (againObj[arrItem[i].cqOption]) {
          let oldIndex = Object.keys(againObj).indexOf(arrItem[i].cqOption);
          this.$refs["value" + i][0].focus();
          this.$message({
            message: `${this.usa[oldIndex]}选项与${this.usa[i]}选项出现重复答案,请重新填写`,
            type: "warning"
          });
          return;
        } else {
          againObj[arrItem[i].cqOption] = arrItem[i].cqOption;
        }
        if (arrItem[i].cqIsRight === true) {
          // 检查是否有正确答案，如果没有则返回提示
          bool = false;
        }
      }
      if (bool) {
        this.$message({
          message: `至少选择一个正确答案，请选择`,
          type: "warning"
        });
        return;
      }
      Api.ModifyQuestion({
        questionId: this.choiceData.tpqQuestion.questionId,
        questionTitle: this.choiceData.tpqQuestion.questionTitle,
        questionTypeId: this.choiceData.tpqQuestion.questionTypeId,
        chooseQuestion: this.choiceData.tpqQuestion.chooseQuestion
      },0).then(res => {
        switch (res.data.code) {
          case 1:
            this.choiceDataClone = JSON.parse(JSON.stringify(this.choiceData))
            this.switchBox();
            this.$message({ message: res.data.message, type: "success" });
            break;
          default:
            this.$message({ message: res.data.message, type: "warning" });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
#ModifyChoice {
  ul,
  li,
  div,
  p,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .box {
    margin-bottom: 15px;
    span:nth-child(2) {
      padding-right: 20px;
    }
    ul li {
      margin: 5px 0;
    }
  }
  .btn {
    margin-top: 15px;
  }
  .el-form {
    margin-bottom: 20px;
    .el-form-item {
      height: 50px;
    }
  }

  .el-button.is-circle {
    padding: 8px;
  }
  .el-input {
    width: calc(100% - 50px);
    margin-right: 12.5px;
  }
  .el-form-item__content .el-button.is-round {
    padding: 7px 15px;
  }
}
</style>