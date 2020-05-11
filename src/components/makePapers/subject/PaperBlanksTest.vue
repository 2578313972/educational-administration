<template>
  <div id="PaperBlanksTest">
    <el-form label-width="80px" ref="paperForm" :model="question.tpqQuestion">
      <el-form-item label="题干">
        <el-button round @click="addValue">插入填空</el-button>
      </el-form-item>

      <el-form-item>
        <el-input
          type="textarea"
          autosize
          ref="questionTitle"
          placeholder="请输入内容"
          v-model="question.tpqQuestion.questionTitle"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="enum"
        v-for="item in question.tpqQuestion.fillQuestion"
        :key="item.fqOrder"
      >
        <span slot="label">{{item.fqOrder}}</span>
        <el-input
          class="paperbtn"
          :placeholder="'请输入第'+item.fqOrder+'个空的答案'"
          v-model="item.fqAnswer"
        ></el-input>
        <el-input-number
          size="small"
          :min="1"
          :max="10"
          v-model="item.fillQuestionScore[0].fqsScore"
        ></el-input-number>
      </el-form-item>
      <el-form-item style="outline: none;" label="题目预览">
        <div class="ls" v-html="lessHtml"></div>
      </el-form-item>
      <el-form-item class="btn">
        <el-button round @click="resetForm">重置</el-button>
        <el-button type="primary" @click="addQuestion" round>新增题目</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Api from "@/http/BMakePaper";
export default {
  data() {
    return {
      num: 0,
      newNum: 0,
      oldNum: 0,

      paperForm: {
        textarea: "",
        data: []
      },

      question: {
        tpqPaperId: 0, //试卷的编号
        tpqScore: 0, //题目的分值
        tpqQuestion: {
          questionTitle: "", //填空题的标题
          questionTypeId: 2, //题目类型 1=选择题 2=填空题 3=问题
          fillQuestion: [
            // {
            //   fqOrder: 1, //填空序号
            //   fqAnswer: "行级标签", //第一个空的答案
            //   fillQuestionScore: [{fqsScore: 2 /**第一个空的分值*/}]
            // },
          ]
        }
      },
      listVal: ""
    };
  },
  props: {
    testPaperId: [String, Number]
  },
  created() {
    this.question.tpqPaperId =
      this.testPaperId || sessionStorage.getItem("testPaperId");
  },
  methods: {
    addValue() {
      this.question.tpqQuestion.questionTitle += "_";
    },
    resetForm() {
      this.question.tpqQuestion.questionTitle = "";
      this.$refs.questionTitle.focus();
    },
    /** 新增题目 */
    addQuestion() {
      let score = 0;
      this.question.tpqQuestion.fillQuestion.forEach(item => {
        score += item.fillQuestionScore[0].fqsScore;
      });
      this.question.tpqScore = score;

      Api.AddQuestionToTestPaper(this.question).then(res => {
        console.log(res);
        switch (res.data.code) {
          case 1:
            this.resetForm();
            this.$message({ message: res.data.message, type: "success" });
            break;
          default:
            this.$message({ message: res.data.message, type: "warning" });
        }
      });
    }
  },
  computed: {
    lessHtml() {
      this.newNum = 0;
      let text = this.question.tpqQuestion.questionTitle;
      for (var i = 0; i < text.length; i++) {
        var res = text.indexOf("_", i);
        if (res === -1) break;
        i = res;
        ++this.newNum;
      }
      if (this.newNum > this.oldNum) {
        for (let i = this.oldNum; i < this.newNum; i++) {
          this.question.tpqQuestion.fillQuestion.push({
            fqOrder: i + 1,
            fqAnswer: "",
            fillQuestionScore: [{ fqsScore: 2 }]
          });
        }
      } else if (this.newNum < this.oldNum) {
        for (let i = 0; i < this.oldNum - this.newNum; i++) {
          this.question.tpqQuestion.fillQuestion.pop();
        }
      }
      this.oldNum = this.newNum;
      let sum = 0;
      for (var i = 0; i < text.length; i++) {
        var res = text.indexOf("_", i);
        if (res === -1) break;
        text = text.replace(
          "_",
          ` <span style='padding:2px 35px;border-bottom: 1px solid black;'>${this.question.tpqQuestion.fillQuestion[sum].fqAnswer}</span>(${this.question.tpqQuestion.fillQuestion[sum].fillQuestionScore[0].fqsScore}分) `
        );
        ++sum;
        i = res;
      }
      return text;
    }
  }
};
</script>

<style lang="less" scoped>
#PaperBlanksTest {
  .btn {
    margin-top: 15px;
  }
  .el-input {
    width: calc(100% - 150px);
    margin-right: 12.5px;
  }
  .el-form-item__content .el-button.is-round {
    padding: 7px 15px;
  }
  .enum span {
    width: 20px;
    line-height: 20px;
    display: inline-block;
    border-radius: 50%;
    background: #f36b72;
    color: white;
    text-align: center;
    cursor: pointer;
    font-size: 18px;
  }
}
</style>