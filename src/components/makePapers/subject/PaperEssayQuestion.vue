<template>
  <div class="tinymce">
    <el-form label-width="80px" ref="paperForm" :model="paperForm">
      <el-form-item label="题干">
        <el-input
          type="textarea"
          ref="textarea"
          autosize
          autofocus
          placeholder="请输入内容"
          v-model="paperForm.tpqQuestion.questionTitle"
        ></el-input>
      </el-form-item>

      <el-form-item label="参考答案">
        <Rich-Text-Box v-model="paperForm.tpqQuestion.answerQuestion.aqAnswer" />
      </el-form-item>

      <el-form-item label="分值">
        <el-input-number size="small" :min="5" :step="5" v-model="paperForm.tpqScore"></el-input-number>
      </el-form-item>

      <el-form-item class="btn">
        <el-button size="small" round @click="resetForm">重置</el-button>
        <el-button size="small" type="primary" @click="submit" round>新增题目</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Api from "@/http/BMakePaper";
import RichTextBox from "@/components/makePapers/RichTextBox";
export default {
  data() {
    return {
      html: "",
      paperForm: {
        tpqPaperId: "", //试卷主键编号
        tpqScore: 5, //分值
        tpqQuestion: {
          questionTitle: "", //题目的标题
          questionTypeId: 3, //题目的类型 1=选择题 2=填空题 3=问答题
          answerQuestion: {
            aqAnswer: "" //问答题的答案
          }
        }
      }
    };
  },
  created() {
    this.paperForm.tpqPaperId = sessionStorage.getItem("testPaperId");
  },
  watch: {
    html(newVal) {
      this.html = newVal;
    }
  },
  components: { RichTextBox },
  methods: {
    resetForm() {
      this.paperForm.tpqQuestion.questionTitle = "";
      this.paperForm.tpqQuestion.answerQuestion.aqAnswer = "";
      this.$refs.textarea.focus();
    },
    submit() {
      if (!this.paperForm.tpqQuestion.questionTitle.trim()) {
        this.$message({ message: "题干不能为空", type: "warning" });
        return this.$refs.textarea.focus();
      }
      if (!this.paperForm.tpqQuestion.answerQuestion.aqAnswer.trim()) {
        this.$message({ message: "答案不能为空", type: "warning" });
        return
      }
      Api.AddQuestionToTestPaper(this.paperForm).then(res => {
        console.log(res);
        switch (res.data.code) {
          case 1:
            this.$emit('addQuestion',res.data.data)
            this.resetForm();
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
</style>








