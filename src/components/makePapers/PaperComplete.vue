<template>
  <div id="PaperComplete">
    <div slot="header" class="clearfix">
      <h3 style="text-align:center;">{{allPaperData.tpTitle}}</h3>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" min-width="130px" prop="course" label="科目"></el-table-column>
      <el-table-column align="center" width="130px" prop="choice" label="选择题">
        <el-badge :value="choiceScore+'\''" class="item"></el-badge>
      </el-table-column>
      <el-table-column align="center" min-width="130px" prop="blank" label="填空题">
        <el-badge :value="blankScore+'\''" class="item"></el-badge>
      </el-table-column>
      <el-table-column align="center" width="130px" prop="essay" label="问答题">
        <el-badge :value="essayScore+'\''" class="item"></el-badge>
      </el-table-column>
      <el-table-column align="center" min-width="150px" prop="sum" label="总分">
        <el-badge :value="zf+'\''" class="item"></el-badge>
      </el-table-column>
    </el-table>
    <div style="text-align:center;margin-top:15px;">
      <slot name="btn"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: []
    }
  },
  props: { allPaperData: Object },
  mounted () {
    this.tableData = [
      {
        course: this.allPaperData.courseName,
        choice: this.choiceScore,
        blank: this.blankScore,
        essay: this.essayScore,
        sum: this.zf
      }
    ]
  },
  watch: {
    allPaperData: {
      handler (newObj) {
        this.tableData = [
          {
            course: this.allPaperData.courseName,
            choice: this.choiceScore,
            blank: this.blankScore,
            essay: this.essayScore,
            sum: this.zf
          }
        ]
      },
      deep: true
    }
  },
  computed: {
    /** 选择题分数 */
    choiceScore () {
      return this.allPaperData.questions
        .filter(item => item.tpqQuestion.questionTypeId === 1)
        .reduce((oldSum, num) => {
          return oldSum + num.tpqScore
        }, 0)
    },
    /** 填空题分数 */
    blankScore () {
      return this.allPaperData.questions
        .filter(item => item.tpqQuestion.questionTypeId === 2)
        .reduce((oldSum, num) => {
          return oldSum + num.tpqScore
        }, 0)
    },
    /** 问答题分数 */
    essayScore () {
      return this.allPaperData.questions
        .filter(item => item.tpqQuestion.questionTypeId === 3)
        .reduce((oldSum, num) => {
          return oldSum + num.tpqScore
        }, 0)
    },
    zf () {
      return this.allPaperData.questions.reduce((oldSum, num) => {
        return oldSum + num.tpqScore
      }, 0)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
