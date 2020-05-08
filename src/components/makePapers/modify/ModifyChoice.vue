<template>
  <div id="ModifyChoice">
    <div class="box" v-for="(item,index) in allChoiceData" :key="item.tpqId">
      <el-form label-width="150px" v-if="!balBool[index]" ref="paperForm" :model="item">
        <el-form-item :label="'第'+(index+1)+'题、'">
          {{item.tpqQuestion.questionTitle}}
          <el-input-number
            v-model="item.tpqScore"
            @change="handleChange(index)"
            size="mini"
            :min="1"
            :max="10"
            label="描述文字"
          ></el-input-number>
        </el-form-item>

        <el-form-item v-for="(qusetion,ind) in item.tpqQuestion.chooseQuestion" :key="ind">
          <el-checkbox slot="label" disabled v-model="qusetion.cqIsRight">{{usa[ind]}}、</el-checkbox>
          <span>{{qusetion.cqOption}}</span>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" @click="switchBox(index)" round>编辑</el-button>
        </el-form-item>
      </el-form>

      <el-form label-width="150px" v-else ref="paperForm" :model="item">
        <el-form-item :label="(index+1)+'、 题干'">
          <el-input
            type="textarea"
            ref="textarea"
            autosize
            autofocus
            placeholder="请输入内容"
            v-model="item.tpqQuestion.questionTitle"
          ></el-input>
        </el-form-item>

        <el-form-item
          class="enum"
          v-for="(qusetion,ind) in item.tpqQuestion.chooseQuestion"
          :key="ind"
        >
          <el-checkbox slot="label" v-model="qusetion.cqIsRight">{{usa[ind]}}、</el-checkbox>
          <el-input class="paperbtn" :ref="'value'+ind" v-model="qusetion.cqOption"></el-input>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            :disabled="item.tpqQuestion.chooseQuestion.length>2?false:true"
            @click="deleteSer(item.tpqQuestion.chooseQuestion,ind)"
          ></el-button>
        </el-form-item>

        <el-form-item class="btn">
          <el-button size="mini" disabled type="primary" round>编辑</el-button>
          <el-button size="mini" type="primary" @click="switchBoxElse(item,index)" round>取消</el-button>
          <el-button size="mini" @click="addValue(item)" round>新增选项</el-button>
          <el-button size="mini" type="primary" @click="submitTitle(item,index)" round>保存修改</el-button>
          <el-button size="mini" type="danger" @click="deleteQuestion(item,index)" round>删除题目</el-button>
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
      ChoiceData: [],
      allChoiceData: [],
      balBool: []
    };
  },
  props: {
    allChoiceSubject: {
      type: Array,
      required: true
    }
  },
  watch: {
    allChoiceSubject(newVal) {
      this.ChoiceData = JSON.parse(JSON.stringify(newVal));
      this.allChoiceData = JSON.parse(JSON.stringify(newVal));
      this.allChoiceData.forEach(item => {
        this.balBool.push(false);
      });
    }
  },
  methods: {
    /** 修改分数 */
    handleChange(index) {
      Api.ModifyScore({
        tpqId: this.allChoiceData[index].tpqId, //主键编号
        tpqScore: this.allChoiceData[index].tpqScore //要修改的分值
      }).then(res => {
        switch (res.data.code) {
          case 1:
            this.$emit(
              "handleChange",
              index,
              this.allChoiceData[index].tpqScore
            );
            this.$message({ message: res.data.message, type: "success" });
            break;
          default:
            this.$message({ message: res.data.message, type: "warning" });
        }
      });
    },
    /** 切换布局事件 */
    switchBox(index) {
      this.$set(this.balBool, index, !this.balBool[index]);
    },
    /** 点击取消 */
    switchBoxElse(item, index) {
      // this.allChoiceData[index] = JSON.parse(JSON.stringify(this.allPaperData.questions[index]))
      this.allChoiceData.splice(
        index,
        1,
        JSON.parse(JSON.stringify(this.ChoiceData[index]))
      );
      this.$set(this.balBool, index, !this.balBool[index]);
    },
    /** 删除题目 */
    deleteQuestion(data, index) {
      Api.RemoveQuestionFromTestPaper({ paperQuestionId: data.tpqId }).then(
        res => {
          switch (res.data.code) {
            case 1:
              this.ChoiceData.splice(index, 1); // 删除组件传来的数据
              this.allChoiceData.splice(index, 1); // 删除显示的数据
              this.balBool.splice(index, 1); // 删除切换布局的布尔值
              this.$emit("deleteQuestion", index);
              this.$message({ message: res.data.message, type: "success" });
              break;
            default:
              this.$message({ message: res.data.message, type: "warning" });
          }
        }
      );
    },
    /** 删除行 */
    deleteSer(data, index) {
      data.splice(index, 1); // 删除选项
    },
    /** 添加选项 */
    addValue(data) {
      if (data.tpqQuestion.chooseQuestion.length >= this.usa.length)
        return this.$message({ message: "已达最大上限", type: "warning" });
      data.tpqQuestion.chooseQuestion.push({
        // 添加选项
        cqIsRight: false,
        cqOption: ""
      });
    },
    /** 保存修改 */
    submitTitle(data, index) {
      if (data.tpqQuestion.questionTitle.trim() === "") {
        this.$message({ message: "题干不能为空", type: "warning" });
        return this.$refs.textarea[0].focus();
      }
      let bool = true;
      let againObj = {};
      let arrItem = data.tpqQuestion.chooseQuestion;
      // console.log(this.$refs);
      // console.log(arrItem.length);

      let len = arrItem.length;
      for (let i = 0; i < len; i++) {
        console.log(i);
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
        questionId: data.tpqQuestion.questionId,
        questionTitle: data.tpqQuestion.questionTitle,
        questionTypeId: data.tpqQuestion.questionTypeId,
        chooseQuestion: data.tpqQuestion.chooseQuestion
      }).then(res => {
        switch (res.data.code) {
          case 1:
            this.ChoiceData.splice(
              index,
              1,
              JSON.parse(JSON.stringify(this.allChoiceData[index]))
            );
            this.$message({ message: res.data.message, type: "success" });
            this.switchBox(index);
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