<template>
  <div id="PaperAddTitle">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="margin-right:6px;">题目类型</span>
        <div id="click">
          <select-question-type v-model="radio" />
        </div>
        <slot name="but"></slot>
      </div>
      <div class="text item">
        <!-- 选择题 -->
        <paper-choice-question
          :testPaperId="testPaperId"
          @addQuestion="addQuestion"
          v-show="radio.typeId===1"
        />
        <!-- 填空题 -->
        <paper-blanks-test
          :testPaperId="testPaperId"
          @addQuestion="addQuestion"
          v-show="radio.typeId===2"
        />
        <!-- 问答题 -->
        <paper-essay-question :testPaperId="testPaperId" @addQuestion="addQuestion" v-show="radio.typeId===3" />
      </div>
    </el-card>

    <el-card class="box-card cardbox">
      <div slot="header" class="clearfix">
        <span>
          一、选择题（本题共{{choiceNum}}道小题，共
          <b>{{choiceScore}}/{{zf}}</b>分）
        </span>
      </div>
      <div class="text item">
        <Modify-Choice
          v-for="(item,index) in allChoiceSubject"
          :item="item"
          :index="index"
          :key="item.tpqId"
          @handleChange="handleChange"
          @deleteQuestion="deleteQuestion"
        />
      </div>
    </el-card>

    <el-card class="box-card cardbox">
      <div slot="header" class="clearfix">
        <span>
          二、填空题（本题共{{blankNum}}道小题，共
          <b>{{blankScore}}/{{zf}}</b>分）
        </span>
      </div>
      <div class="text item">
        <ModifyBlank
          v-for="(item,index) in allBlankSubject"
          :item="item"
          :index="index"
          :key="item.tpqId"
          @deleteQuestion="deleteQuestion"
        />
      </div>
    </el-card>

    <el-card class="box-card cardbox">
      <div slot="header" class="clearfix">
        <span>
          三、问答题（本题共{{essayNum}}道小题，共
          <b>{{essayScore}}/{{zf}}</b>分）
        </span>
      </div>
      <div class="text item">
        <ModifyEssay
          v-for="(item,index) in allEssaySubject"
          :item="item"
          :index="index"
          :key="item.tpqId"
          @handleChange="handleChange"
          @deleteQuestion="deleteQuestion"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import Api from '@/http/BMakePaper'
import SelectQuestionType from '@/components/selectionBox/SelectQuestionType' // 题目类型组件
import PaperChoiceQuestion from '@/components/makePapers/subject/PaperChoiceQuestion' // 选择题组件
import PaperBlanksTest from '@/components/makePapers/subject/PaperBlanksTest' // 填空题组件
import PaperEssayQuestion from '@/components/makePapers/subject/PaperEssayQuestion' // 问答题组件
import ModifyChoice from '@/components/makePapers/modify/ModifyChoice' // 修改选择题组件
import ModifyBlank from '@/components/makePapers/modify/ModifyBlank' // 修改填空题组件
import ModifyEssay from '@/components/makePapers/modify/ModifyEssay' // 修改问答题组件

export default {
  data () {
    return {
      radio: { typeId: '1', typeName: '', type: 'click' }, // 单选按钮
      choiceNum: 0,
      blankNum: 0,
      essayNum: 0
    }
  },
  props: {
    allQuestions: Array,
    testPaperId: [String, Number]
  },
  computed: {
    /** 选择题 */
    allChoiceSubject () {
      return this.allQuestions.filter(
        item => item.tpqQuestion.questionTypeId === 1
      )
    },
    /** 选择题分数 */
    choiceScore () {
      this.choiceNum = 0
      return this.allChoiceSubject.reduce((oldSum, num) => {
        ++this.choiceNum
        return oldSum + num.tpqScore
      }, 0)
    },
    /** 填空题 */
    allBlankSubject () {
      return this.allQuestions.filter(
        item => item.tpqQuestion.questionTypeId === 2
      )
    },
    /** 填空题分数 */
    blankScore () {
      this.blankNum = 0
      return this.allBlankSubject.reduce((oldSum, num) => {
        ++this.blankNum
        return oldSum + num.tpqScore
      }, 0)
    },
    /** 问答题 */
    allEssaySubject () {
      return this.allQuestions.filter(
        item => item.tpqQuestion.questionTypeId === 3
      )
    },
    /** 问答题分数 */
    essayScore () {
      this.essayNum = 0
      return this.allEssaySubject.reduce((oldSum, num) => {
        ++this.essayNum
        return oldSum + num.tpqScore
      }, 0)
    },
    /** 总分 */
    zf () {
      return this.allQuestions.reduce(
        (oldSum, num) => oldSum + num.tpqScore,
        0
      )
    }
  },
  methods: {
    /** 添加选择题、填空题、问答题 */
    addQuestion (data) {
      this.allQuestions.push(data)
    },
    /** 选择题、问答题 修改分数 */
    handleChange (id, score) {
      this.allQuestions.find(item => item.tpqId === id).tpqScore = score
    },
    /** 选择题、填空题、问答题 删除题目 */
    deleteQuestion (id) {
      const index = this.allQuestions.findIndex(item => item.tpqId === id)
      this.allQuestions.splice(index, 1)
    }
  },
  components: {
    SelectQuestionType,
    PaperChoiceQuestion,
    PaperBlanksTest,
    PaperEssayQuestion,
    ModifyChoice,
    ModifyBlank,
    ModifyEssay
  }
}
</script>

<style lang="less" scoped>
#PaperAddTitle {
  margin: 0;
  .cardbox {
    margin-top: 25px;
  }
  #click {
    display: inline-block;
    width: calc(100% - 150px) !important;
  }
  .clearfix > span > b {
    padding: 0px 4px;
    font-weight: 500;
    text-align: center;
    margin: 0 5px;
    display: inline-block;
    border-radius: 20px;
    background: #f56c6c;
    color: white;
  }
}
</style>
