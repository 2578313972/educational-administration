<template>
  <div id="PaperAddTitle">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="margin-right:6px;">题目类型</span>
        <div id="click">
          <select-question-type v-model="radio" />
        </div>
        <el-button style="float: right; padding: 6px;" type="primary">操作按钮</el-button>
      </div>
      <div class="text item">
        <paper-choice-question :testPaperId="testPaperId" @choiceQuestion="choiceQuestion" v-show="radio.typeId===1" />
        <paper-blanks-test v-show="radio.typeId===2" />
        <paper-essay-question v-show="radio.typeId===3" />
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
        <Modify-Choice :allChoiceSubject="allChoiceSubject" @handleChange="handleChange" @deleteQuestion="deleteQuestion" />
      </div>
    </el-card>

    <el-card class="box-card cardbox">
      <div slot="header" class="clearfix">
        <span>
          一、填空题（本题共{{blankNum}}道小题，共
          <b>{{blankScore}}/{{zf}}</b>分）
        </span>
      </div>
      <div class="text item"></div>
    </el-card>

    <el-card class="box-card cardbox">
      <div slot="header" class="clearfix">
        <span>
          一、问答题（本题共{{essayNum}}道小题，共
          <b>{{essayScore}}/{{zf}}</b>分）
        </span>
      </div>
      <div class="text item"></div>
    </el-card>
  </div>
</template>

<script>
import Api from "@/http/BMakePaper";
import SelectQuestionType from "@/components/selectionBox/SelectQuestionType"; // 题目类型组件
import PaperChoiceQuestion from "@/components/makePapers/subject/PaperChoiceQuestion"; // 选择题组件
import PaperBlanksTest from "@/components/makePapers/subject/PaperBlanksTest"; // 填空题组件
import PaperEssayQuestion from "@/components/makePapers/subject/PaperEssayQuestion"; // 问答题组件
import ModifyChoice from "@/components/makePapers/modify/ModifyChoice"; // 修改选择题组件

export default {
  data() {
    return {
      radio: { typeId: "0", typeName: "", type: "click" }, // 单选按钮
      allPaperData: {}, // 试卷的所有数据
      allChoiceSubject: [], // 选择题
      allBlankSubject: [], // 填空题
      allEssaySubject: [], // 问答题
      choiceNum: 0,
      blankNum: 0,
      essayNum: 0,
    };
  },
  props:{
    testPaperId:[String, Number]
  },
  created() {
    let id = this.testPaperId || sessionStorage.getItem('testPaperId')
    Api.GetTestPaper({ id }).then(res => {
        this.allPaperData = res.data;
        res.data.questions.forEach(item=>{
          switch (item.tpqQuestion.questionTypeId){ // 筛选题目类型
            case 1:
              this.allChoiceSubject.push(item)
              break;
            case 2:
              this.allBlankSubject.push(item)
              break;
            case 3:
              this.allEssaySubject.push(item)
              break;
          }
        })
    });
  },
  computed: {
    /** 填空题分数 */
    choiceScore() {
      this.choiceNum = 0;
      let sum = 0
      try {
        this.allChoiceSubject.map(item => {
            sum += item.tpqScore;
            ++this.choiceNum;
        });
      } catch (error) {}

      return sum;
    },
    /** 填空题分数 */
    blankScore() {
      this.choiceNum = 0;
      let sum = 0
      try {
        this.allBlankSubject.map(item => {
            sum += item.tpqScore;
            ++this.blankNum;
        });
      } catch (error) {}

      return sum;
    },
    /** 问答题分数 */
    essayScore() {
      this.choiceNum = 0;
      let sum = 0
      try {
        this.allEssaySubject.map(item => {
            sum += item.tpqScore;
            ++this.essayNum;
        });
      } catch (error) {}

      return sum;
    },
    /** 总分 */
    zf(){
      let num = 0
      try {
        this.allChoiceSubject.map(item => {
            num += item.tpqScore;
        });
        this.allBlankSubject.map(item => {
            num += item.tpqScore;
        });
        this.allEssaySubject.map(item => {
            num += item.tpqScore;
        });
      } catch (error) {}

      return  num
    }
  },
  methods: {
    /** 添加选择题 */
    choiceQuestion(res) {
      this.allChoiceSubject.push({
        tpqId: res.tpqId,
        tpqPaperId: res.tpqPaperId,
        tpqQuestion: res.tpqQuestion,
        tpqQuestionId: res.tpqQuestionId,
        tpqScore: res.tpqScore
      });
    },
    /** 选择题修改分数 */
    handleChange(index,score){
      this.allChoiceSubject[index].tpqScore = score
      console.log(score);
    },
    /** 选择题删除题目 */
    deleteQuestion(index){
      this.allChoiceSubject.splice(index,1)
    }
  },
  components: {
    SelectQuestionType,
    PaperChoiceQuestion,
    PaperBlanksTest,
    PaperEssayQuestion,
    ModifyChoice
  }
};
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