<template>
  <div id="BTeacher">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-steps :active="active" align-center finish-status="success">
          <el-step title="试卷信息"></el-step>
          <el-step title="添加题目"></el-step>
          <el-step title="完成制作"></el-step>
        </el-steps>
      </div>
      <div class="text item">
        <Paper-Message @next="choiceNext" v-if="active===0" />
        <Paper-AddTitle
          :allQuestions="allPaperData.questions"
          :testPaperId="testPaperId"
          v-if="active===1"
        >
          <template>
            <el-button
              slot="but"
              @click="next"
              style="float: right; padding: 6px;"
              type="primary"
            >完成制作</el-button>
          </template>
        </Paper-AddTitle>
        <Paper-Complete :allPaperData="allPaperData" v-if="active===3" >
          <template>
            <el-button slot="btn" @click="active-=2" size="medium" type="primary">上一步</el-button>
          </template>
        </Paper-Complete>
      </div>
    </el-card>
  </div>
</template>

<script>
import Api from "@/http/BMakePaper";

import PaperMessage from "@/components/makePapers/PaperMessage";
import PaperAddTitle from "@/components/makePapers/PaperAddTitle";
import PaperComplete from "@/components/makePapers/PaperComplete";
export default {
  data() {
    return {
      active: 0, // 步骤位置
      testPaperId: "", // 试卷id
      allPaperData: { questions: [] } // 试卷数据
    };
  },
  created() {
    let id = this.testPaperId || sessionStorage.getItem("testPaperId");
    if (!id) return;
    Api.GetTestPaper({ id }).then(res => {
      this.allPaperData = res.data;
      console.log(res.data);
    });
    if (sessionStorage.getItem("testPaperId")) {
      this.active = 1;
    }
  },
  methods: {
    next() {
      /** 跳转至下一步操作 */
      if (this.active == 1) return (this.active += 2);
      if (this.active++ > 2) this.active = 0;
    },
    choiceNext(id) {
      this.testPaperId = id;
      ++this.active;
      Api.GetTestPaper({ id }).then(res => {
        this.allPaperData = res.data;
      });
    }
  },
  components: { PaperMessage, PaperAddTitle, PaperComplete }
};
</script>

<style lang="less" scoped>
#BTeacher {
  /** 上半部分 */
  .el-card__header {
    box-sizing: border-box;
    padding: 20px 0;
    .el-steps {
      width: 75%;
      margin: auto;
    }
  }
}
</style>