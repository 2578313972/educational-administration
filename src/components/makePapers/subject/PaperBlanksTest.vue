<template>
  <div id="PaperBlanksTest">
    <el-form label-width="80px" :model="question.tpqQuestion">
      <el-form-item label="题干">
        <el-button round @click="addValue">插入填空</el-button>
      </el-form-item>

      <el-form-item>
        <el-input
          type="textarea"
          autosize
          @input="changeInput"
          ref="questionTitle"
          placeholder="请输入内容"
          v-model="question.tpqQuestion.questionTitle"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="enum"
        v-for="(item,index) in question.tpqQuestion.fillQuestion"
        :key="item.fqOrder"
      >
        <span slot="label">{{index+1}}</span>
        <el-input class="paperbtn" :placeholder="'请输入第'+(index+1)+'个空的答案'" v-model="item.fqAnswer"></el-input>
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
      newNum: 0, // 新下划线的数量
      oldNum: 0, // 旧下划线的数量
      inputChangeIndex: "", // input光标位置
      question: {
        tpqPaperId: 0, //试卷的编号
        tpqScore: 0, //题目的分值
        tpqQuestion: {
          questionTitle: "abcd", //填空题的标题
          questionTypeId: 2, //题目类型 1=选择题 2=填空题 3=问题
          fillQuestion: []
        }
      },
    };
  },
  props: {
    testPaperId: [String, Number] // 试卷id
  },
  created() {
    this.question.tpqPaperId =
      this.testPaperId || sessionStorage.getItem("testPaperId");
  },
  watch: {
    // "question.tpqQuestion.questionTitle"(newV, oldV) {
    //   function diff(newV, oldV) {
    //     let startChangeInd, endChangeInd, addV, deleteV, abs, len;
    //     len = Math.max(newV.length, oldV.length);

    //     for (let i = 0; i < len; i++) {
    //       if (newV.charAt(i) !== oldV.charAt(i)) {
    //         startChangeInd = i;
    //         break;
    //       }
    //     }
    //     addV = newV.substring(startChangeInd); // 新的数据
    //     deleteV = oldV.substring(startChangeInd); // 旧数据
    //     // abs = Math.abs(newV.length - oldV.length) // 两个数的绝对值
    //     // console.log('新的数据:'+addV+'\n'+'旧数据: '+deleteV);
    //     let lodIndex;
    //     for (let i = 0; i < len; i++) {
    //       if (
    //         newV.charAt(newV.length - 1 - i) !==
    //         oldV.charAt(oldV.length - 1 - i)
    //       ) {
    //         lodIndex = i;
    //         break;
    //       }
    //     }

    //     let newStr = newV.length - lodIndex
    //     let oldStr = oldV.length - lodIndex
    //     let newString = newV.substring(startChangeInd,newStr)
    //     let oldString = oldV.substring(startChangeInd,oldStr)
    //     console.log(newString,oldString);

    //     // console.log('起始下标:'+startChangeInd+' 新值：'+newV.slice(startChangeInd,endChangeInd)+'\n'+'结束下标:'+lodIndex+' 旧值：');
    //   }
    //   diff(newV, oldV);
    // }
  },
  methods: {
    /** 点击插入填空 */
    addValue() {
      this.$refs.questionTitle.focus();
      document.execCommand("insertText", true, "▁");
    },
    /** input change事件 */
    changeInput(e) {
      this.inputChangeIndex = event.target.selectionEnd; // 将光标的位置保存
    },
    /** 重置 */
    resetForm() {
      this.question.tpqQuestion.questionTitle = "";
      this.$refs.questionTitle.focus();
    },
    /** 新增题目 */
    addQuestion() {
      this.question.tpqQuestion.fillQuestion.map(
        (item, index) => (item.fqOrder = index + 1)
      ); // 添加序号
      let score = 0;
      this.question.tpqQuestion.fillQuestion.forEach(item => {
        score += item.fillQuestionScore[0].fqsScore;
      }); // 计算分数
      this.question.tpqScore = score;
      Api.AddQuestionToTestPaper(this.question).then(res => {
        switch (res.data.code) {
          case 1:
            this.$emit("addQuestion", res.data.data);
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
      let text = this.question.tpqQuestion.questionTitle; // 将题目用text保存
      this.newNum = text.split("▁").length - 1; // 获取下划线的数量
      let len = text.slice(0, this.inputChangeIndex).split("▁").length - 1; // 获取光标前的下划线数量
      if (this.newNum > this.oldNum) {
        /** 当新增下滑线时 */
        for (let i = 0; i < this.newNum - this.oldNum; i++) { // for 检测一次性添加多少个
          this.question.tpqQuestion.fillQuestion.splice(len - this.newNum + this.oldNum, 0, {
            fqAnswer: "",
            fillQuestionScore: [{ fqsScore: 2 }]
          });
        }
      } else if (this.newNum < this.oldNum) {
        /** 当新删除下滑线时 */
        for (let i = 0; i < this.oldNum - this.newNum; i++) { //  for 检测一次性删除多少个
          this.question.tpqQuestion.fillQuestion.splice(len, 1);
        }
      }
      this.oldNum = this.newNum; // 更新旧下划线的数量
      let sum = 0; // 渲染数据需要使用的下标
      for (var i = 0; i < text.length; i++) {
        var res = text.indexOf("▁", i); // 当出现 '▁' 时替换成html代码片段
        if (res === -1) break; // 找不到 '▁' 直接结束循环
        text = text.replace(
          "▁",
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
    font-size: 13px;
  }
}
</style>