<template>
  <div id="ModifyEssay">
    <div class="box">
      <el-form label-width="150px" v-if="!balBool" ref="paperForm" :model="qusetionData">
        <el-form-item :label="'第'+(index+1)+'题、'">
          {{qusetionData.tpqQuestion.questionTitle}}
          <el-input-number
            v-model="qusetionData.tpqScore"
            @change="handleChange"
            size="mini"
            :min="5"
            :step="5"
            label="描述文字"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="参考答案：">
          <span v-html="qusetionData.tpqQuestion.answerQuestion.aqAnswer"></span>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" @click="switchBox(index)" round>编辑</el-button>
        </el-form-item>
      </el-form>

      <el-form label-width="150px" v-else ref="paperForm" :model="qusetionData">
        <el-form-item :label="(index+1)+'、 题干：'">
          <el-input
            type="textarea"
            ref="textarea"
            autosize
            autofocus
            placeholder="请输入内容"
            v-model="qusetionData.tpqQuestion.questionTitle"
          ></el-input>
        </el-form-item>

        <el-form-item label="参考答案：" class="enum">
          <Rich-Text-Box v-model="qusetionData.tpqQuestion.answerQuestion.aqAnswer" />
        </el-form-item>

        <el-form-item class="btn">
          <el-button size="mini" disabled type="primary" round>编辑</el-button>
          <el-button size="mini" type="primary" @click="switchBoxElse" round>取消</el-button>
          <el-button size="mini" type="primary" @click="submitTitle" round>保存修改</el-button>
          <el-button size="mini" type="danger" @click="deleteQuestion" round>删除题目</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Api from "@/http/BMakePaper";
import RichTextBox from "@/components/makePapers/RichTextBox";

export default {
  data() {
    return {
      qusetionData: {},
      qusetionDataClone: {},
      balBool: false,
    };
  },
  props: {
    item: Object,
    index: Number
  },
  created() {
    this.qusetionData = JSON.parse(JSON.stringify(this.item));
    this.qusetionDataClone = JSON.parse(JSON.stringify(this.item));
  },
  methods: {
    /** 切换布局事件 */
    switchBox() {
      this.balBool = !this.balBool;
    },
    /** 点击取消 */
    switchBoxElse() {
      this.qusetionData = JSON.parse(JSON.stringify(this.qusetionDataClone));
      this.switchBox();
    },
    /** 修改分数 */
    handleChange() {
      Api.ModifyScore({
        tpqId: this.qusetionData.tpqId, //主键编号
        tpqScore: this.qusetionData.tpqScore //要修改的分值
      }).then(res => {
        switch (res.data.code) {
          case 1:
            this.$emit(
              "handleChange",
              this.qusetionData.tpqId,
              this.qusetionData.tpqScore
            );
            this.$message({ message: res.data.message, type: "success" });
            break;
          default:
            this.$message({ message: res.data.message, type: "warning" });
        }
      });
    },
    /** 删除题目 */
    deleteQuestion() {
      Api.RemoveQuestionFromTestPaper({
        paperQuestionId: this.qusetionData.tpqId
      }).then(res => {
        switch (res.data.code) {
          case 1:
            this.$emit("deleteQuestion", this.qusetionData.tpqId);
            this.$message({ message: res.data.message, type: "success" });
            break;
          default:
            this.$message({ message: res.data.message, type: "warning" });
        }
      });
    },
    /** 保存修改 */
    submitTitle() {
      if (this.qusetionData.tpqQuestion.questionTitle.trim() === "") {
        this.$message({ message: "题干不能为空", type: "warning" });
        return this.$refs.textarea[0].focus();
      }
      if (this.qusetionData.tpqQuestion.answerQuestion.aqAnswer.trim() === "") {
        this.$message({ message: "答案不能为空", type: "warning" });
        return
      }
      delete this.qusetionData.tpqQuestion.chooseQuestion
      delete this.qusetionData.tpqQuestion.fillQuestion
      delete this.qusetionData.tpqQuestion.answerQuestion.aqQuestionId

      Api.ModifyQuestion(this.qusetionData.tpqQuestion,0).then(res => {
        switch (res.data.code) {
          case 1:
            this.qusetionDataClone = JSON.parse(
              JSON.stringify(this.qusetionData)
            );
            this.switchBox();
            this.$message({ message: res.data.message, type: "success" });
            break;
          default:
            this.$message({ message: res.data.message, type: "warning" });
        }
      });
    }
  },
  components: { RichTextBox }
};
</script>

<style lang="less" scoped>
#ModifyEssay {
  padding: 10px 0;
  border-bottom: 1px solid #888;
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
    // .el-form-item {
    //   height: 50px;
    // }
  }
  .enum{
    margin-top: 15px;
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