<template>
  <div ref="aab" id="BReadoverZJ">
    <div class="top">
      <div class="box">
        <el-button size="small" disabled type="info" plain>待批阅</el-button>
      </div>
      <div class="box">
        <el-button
          v-for="item in allStudentNoHasView"
          :key="item.testUid"
          @click="lookStu(item.testUid)"
          size="mini"
          round
        >{{item.stuName}}</el-button>
      </div>
      <div class="box">
        <el-button size="small" disabled type="success" plain>已批阅</el-button>
      </div>
      <div class="box">
        <el-button
          v-for="item in allStudentHasView"
          :key="item.testUid"
          @click="lookStu(item.testUid)"
          size="mini"
          type="success"
          round
        >{{item.stuName}}</el-button>
      </div>
    </div>

    <div v-if="hasView" class="content">
      <div slot="header" class="clearfix">
        <h3 style="text-align:center;">{{allPaperData.tpTitle}}</h3>
      </div>
      <el-table :data="tableData_1" border style="width: 100%">
        <el-table-column align="center" min-width="100px" prop="stuName" label="姓名"></el-table-column>
        <el-table-column align="center" width="100px" prop="className" label="班级"></el-table-column>
        <el-table-column align="center" min-width="160px" prop="testSubmitTime" label="交卷"></el-table-column>
        <el-table-column align="center" width="100px" prop="choice" label="选择题得分"></el-table-column>
        <el-table-column align="center" width="100px" prop="blank" label="填空题得分"></el-table-column>
        <el-table-column align="center" width="100px" prop="essay" label="问答题得分"></el-table-column>
        <el-table-column align="center" min-width="100px" prop="testScore" label="成绩"></el-table-column>
      </el-table>
      <!-- 选择题 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>选择题（本大题共{{choice.length}}道，共{{choiseScore}}分，得{{haveChoiseScore}}分 ）</span>
        </div>
        <el-form v-for="(item,index) in choice" :key="item.id" label-width="20px">
          <el-form-item :label="index+1+'、'">
            <span>{{item.questionTitle}} {{"("+item.testPaperScore}}分)</span>
          </el-form-item>
          <el-form-item
            v-for="(item_2,index_2) in item.choseQuestions.questions"
            :key="item_2.cqId"
          >
            {{usa[index_2]+"、"+item_2.cqOption}}
            <span
              v-if="item_2.cqIsRight"
              style="color:#0A9980;"
              class="el-icon-success"
            ></span>
          </el-form-item>
          <el-form-item>
            <el-tag type="info">
              我的答案 【
              <span
                v-for="item_3 in item.choseQuestions.myChoose"
                :key="item_3"
              >{{usa[item.choseQuestions.questions.findIndex(num=>num.cqId===item_3)]}} </span> 】
            </el-tag>
            <el-tag style="margin:0 10px;" type="danger">得分</el-tag>
            <el-badge :value="item.score" class="item"></el-badge>
          </el-form-item>
          <el-divider></el-divider>
        </el-form>
      </el-card>
      <!-- 填空题 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>填空题（本大题共{{blank.length}}道，共{{blankScore}}分，得{{haveBlankScore}}分 ）</span>
        </div>
        <el-form v-for="(item,index) in blank" :key="item.id" label-width="20px">
          <el-form-item :label="index+1+'、'">
            <span v-for="(data,ind) in item.questionTitle.split('▁')" :key="ind">
              {{data}}
              <span
                v-if="item.fillQuestion.questions[ind]"
                style="border-bottom: 1px solid black;padding:0 15px;"
              >{{item.fillQuestion.questions[ind].fqAnswer}}</span>
              <span
                v-if="item.fillQuestion.questions[ind]"
              >{{'('+item.fillQuestion.questions[ind].socre+'分)'}}</span>
            </span>
          </el-form-item>

          <el-form-item>
            <el-tag style="margin:10px 0;" type="warning">学生答案</el-tag>
          </el-form-item>
          <el-form-item v-for="(item_2,index_2) in item.fillQuestion.myFill" :key="item_2.id">
            空{{index_2+1}}
            <span
              style="border-bottom: 1px solid black;padding:0 15px;"
            >{{item_2.fillAnswer}}</span>
            <el-tag style="margin:0 10px;" type="danger">得分</el-tag>
            <el-input-number
              size="small"
              v-model="item_2.fillScore"
              controls-position="right"
              @change="handleChangeBlank(item)"
              :min="0"
              :max="item.fillQuestion.questions[index_2].socre"
            ></el-input-number>
          </el-form-item>
          <el-divider></el-divider>
        </el-form>
      </el-card>
      <!-- 问答题 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>问答题（本大题共{{essay.length}}道，共{{essayScore}}分，得{{haveEssayScore}}分 ）</span>
        </div>
        <el-form v-for="(item,index) in essay" :key="item.id" label-width="20px">
          <el-form-item :label="index+1+'、'">{{item.questionTitle}} {{"("+item.testPaperScore}}分)</el-form-item>
          <el-form-item class="answer">
            <h4>学生答案</h4>
            <div v-html="item.myAnswer"></div>
          </el-form-item>
          <el-form-item>
            <el-tag style="margin:0 10px;" type="danger">得分</el-tag>
            <el-input-number
              size="small"
              v-model="item.score"
              controls-position="right"
              :min="0"
              :max="item.testPaperScore"
            ></el-input-number>
          </el-form-item>
          <el-form-item class="answer">
            <h4>参考答案</h4>
            <div v-html="item.answer"></div>
          </el-form-item>
          <el-divider></el-divider>
        </el-form>
      </el-card>
      <div class="bottom">
        <el-tag type="info">
          学生成绩
          <el-badge :value="allPaperData.testScore" class="item"></el-badge>分
        </el-tag>
        <el-button style="margin-left:15px;" size="small" @click="commitPaper" type="primary">保存阅卷</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/http/BReadover";

import PaperAddTitle from "@/components/makePapers/PaperAddTitle";
import PaperComplete from "@/components/makePapers/PaperComplete";
export default {
  data() {
    return {
      allStudentData: [], // 获取所有学生
      allStudentHasView: [], // 已阅卷的学生
      allStudentNoHasView: [], // 未阅卷的学生
      testUid: "", // 学生id
      allPaperData: { questions: [] }, // 试卷所有数据
      tableData_1: [{}], // 分数表格
      hasView: false, // 是否显示学生试卷信息
      choice: [], // 选择题
      blank: [], // 填空题
      essay: [], // 问答题
      usa: ["A", "B", "C", "D", "E", "F", "G"], // 选择题选项
    };
  },
  created() {
    Api.GetStudentTest({ taskId: this.$route.query.paperId }).then(res => {
      this.allStudentData = res.data;
      this.allStudentHasView = this.allStudentData.filter(item => item.hasView);
      this.allStudentNoHasView = this.allStudentData.filter(
        item => !item.hasView
      );
    });
  },
  watch: {
    /** 监听学生会改变的数据 计算分数 */
    allPaperData: {
      handler(newObj) {
        this.tableData_1 = [
          {
            stuName: newObj.stuName,
            className: newObj.className,
            testSubmitTime: newObj.testSubmitTime,
            testScore: newObj.testScore
          }
        ];
        this.tableData_1[0].choice = this.choice.reduce(
          (num, item) => num + item.score,
          0
        );
        this.tableData_1[0].blank = this.blank.reduce(
          (num, item) => num + item.score,
          0
        );
        this.tableData_1[0].essay = this.essay.reduce(
          (num, item) => num + item.score,
          0
        );
        this.allPaperData.testScore =
          this.tableData_1[0].choice +
          this.tableData_1[0].blank +
          this.tableData_1[0].essay;
        this.tableData_1[0].testScore = this.allPaperData.testScore;
      },
      deep: true
    }
  },
  computed: {
    /** 选择题总分 */
    choiseScore() {
      return this.choice.reduce((num, item) => num + item.testPaperScore, 0);
    },
    /** 选择题得分 */
    haveChoiseScore() {
      return this.choice.reduce((num, item) => num + item.score, 0);
    },
    /** 填空题总分 */
    blankScore() {
      return this.blank.reduce((num, item) => num + item.testPaperScore, 0);
    },
    /** 填空题得分 */
    haveBlankScore() {
      return this.blank.reduce((num, item) => num + item.score, 0);
    },
    /** 问答题总分 */
    essayScore() {
      return this.essay.reduce((num, item) => num + item.testPaperScore, 0);
    },
    /** 问答题得分 */
    haveEssayScore() {
      return this.essay.reduce((num, item) => num + item.score, 0);
    }
  },
  methods: {
    /** 点击学生获取对应试卷 */
    lookStu(testUid) {
      this.testUid = testUid;
      Api.GetStudentTestPaper({ testUid }).then(res => {
        this.allPaperData = res.data;
        this.tableData_1 = [
          {
            stuName: this.allPaperData.stuName,
            className: this.allPaperData.className,
            testSubmitTime: this.allPaperData.testSubmitTime,
            testScore: this.allPaperData.testScore
          }
        ];
        this.hasView = true;
        // 选择题
        this.choice = this.allPaperData.questions.filter(
          item => item.questionTypeId === 1
        );
        this.tableData_1[0].choice = this.choice.reduce(
          (num, item) => num + item.score,
          0
        );
        // 填空题
        this.blank = this.allPaperData.questions.filter(
          item => item.questionTypeId === 2
        );
        this.tableData_1[0].blank = this.blank.reduce(
          (num, item) => num + item.score,
          0
        );
        // 问答题
        this.essay = this.allPaperData.questions.filter(
          item => item.questionTypeId === 3
        );
        this.tableData_1[0].essay = this.essay.reduce(
          (num, item) => num + item.score,
          0
        );
      });
    },
    /** 计算填空题分数 */
    handleChangeBlank(data) {
      data.score = data.fillQuestion.myFill.reduce(
        (num, item) => num + item.fillScore,
        0
      );
    },
    /** 保存分数 */
    commitPaper() {
      let userUid = this.$store.state.userData.userUid;
      let data = {
        id: this.allPaperData.id,
        testScore: this.allPaperData.testScore,
        studentAnswer: []
      };
      this.essay.forEach(item => {
        data.studentAnswer.push({ id: item.id, score: item.score });
      });
      this.blank.forEach(item => {
        let arrSCore = [];
        item.fillQuestion.myFill.forEach(item_2 => {
          arrSCore.push({ id: item_2.id, fillScore: item_2.fillScore });
        });
        data.studentAnswer.push({
          id: item.id,
          score: item.score,
          fillOption: arrSCore
        });
      });
      Api.SetTestPaperScore(data, { userUid }).then(res => {
        switch (res.data.code) {
          case 1:
            let isuseInd = this.allStudentNoHasView.findIndex(
              item => item.testUid === this.testUid
            );
            if (isuseInd !== -1) {
              this.allStudentHasView.push(
                this.allStudentNoHasView.splice(isuseInd, 1)[0]
              );
            }
            document.getElementsByClassName('main')[0].scrollTop = 0
            this.$message({ type: "success", message: res.data.message });
            break;
          default:
            this.$message({ type: "warning", message: res.data.message });
            break;
        }
      });
    }
  }
};
</script>

<style lang="less">
#BReadoverZJ {
  .top {
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #e9e6ec;
    .box {
      box-sizing: border-box;
      min-height: 30px;
      padding: 10px 0;
      &:nth-child(1),
      &:nth-child(2) {
        border-bottom: 1px solid #e9e6ec;
      }
      &:nth-child(2n-1) {
        // min-width: 90px;
        width: 15%;
        text-align: center;
        border-right: 1px solid #e9e6ec;
      }
      &:nth-child(2n) {
        width: 85%;
        padding: 10px 10px;
      }
    }
  }
  .el-form-item {
    margin: 0;
  }

  .box-card {
    margin-top: 15px;
  }
  .pSelect {
    line-height: 30px;
    padding-left: 10px;
  }
  .answer {
    padding: 15px 8px;
    margin: 10px 0;
    box-sizing: border-box;
    background: #f4f4f4;
    border-radius: 8px;
  }
  .answer h4 {
    margin: 0 0 8px 0;
  }
  .bottom {
    text-align: center;
    margin: 10px 0;
  }
  .el-badge__content {
    transform: translateY(2px);
  }
}
</style>