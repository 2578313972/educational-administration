<template>
  <div id="ModifyBlank">
    <div class="box">
      <el-form class="one" label-width="80px" v-if="!balBool" ref="paperForm" :model="qusetionData">
        <el-form-item :label="'第'+(+index+1)+'题、'">
          <span v-for="(item,index) in len" :key="index">
            {{item}}
            <span
              class="itemspan"
              v-if="qusetionData.tpqQuestion.fillQuestion[index]"
            >{{qusetionData.tpqQuestion.fillQuestion[index].fqAnswer}}</span>

            <el-input-number
              v-if="qusetionData.tpqQuestion.fillQuestion[index]"
              size="mini"
              :min="1"
              :max="10"
              @change="handleChange(index)"
              v-model="qusetionData.tpqQuestion.fillQuestion[index].fillQuestionScore[0].fqsScore"
            ></el-input-number>
          </span>
        </el-form-item>

        <el-form-item>
            <el-button size="mini" type="danger" @click="deleteQuestion" round>删除题目</el-button>
          <el-button size="small" @click="switchBox(index)" round>编辑</el-button>
        </el-form-item>
      </el-form>

      <!--  -->
      <el-form label-width="80px" v-else :model="qusetionData">
        <el-form-item label="题干">
          <el-button round icon="el-icon-document-add" @click="addValue">插入填空</el-button>
        </el-form-item>

        <el-form-item>
          <el-input
            type="textarea"
            autosize
            @input="changeInput"
            ref="questionTitle"
            placeholder="请输入内容"
            v-model="qusetionData.tpqQuestion.questionTitle"
          ></el-input>
        </el-form-item>
        <el-form-item
          class="enum"
          v-for="(item,index) in qusetionData.tpqQuestion.fillQuestion"
          :key="item.fqOrder"
        >
          <span class="boxspan" slot="label">{{index+1}}</span>
          <el-input
            class="paperbtn"
            :placeholder="'请输入第'+(index+1)+'个空的答案'"
            v-model="item.fqAnswer"
          ></el-input>
        </el-form-item>
        <el-form-item style="outline: none;" label="题目预览">
          <div class="ls" v-html="lessHtml"></div>
        </el-form-item>
        <el-form-item class="btn">
          <el-button size="mini" disabled type="primary" round>编辑</el-button>
          <el-button size="mini" type="primary" @click="switchBoxElse" round>取消</el-button>
          <el-button size="mini" type="primary" @click="submitTitle" round>保存修改</el-button>
          <el-button size="mini" type="danger" @click="deleteQuestion" round>删除题目</el-button>
        </el-form-item>
      </el-form>
      <!--  -->
    </div>
  </div>
</template>

<script>
import Api from '@/http/BMakePaper'
// import RichTextBox from '@/components/makePapers/RichTextBox'

export default {
  data () {
    return {
      newNum: 0,
      oldNum: 0,
      inputChangeIndex: '',
      qusetionData: {},
      qusetionDataClone: {},
      balBool: false,
      len: []
    }
  },
  props: {
    item: Object,
    index: Number
  },
  created () {
    this.qusetionData = this.item // 数据渲染
    this.qusetionDataClone = JSON.parse(JSON.stringify(this.item)) // 数据替换
    this.oldNum = this.qusetionData.tpqQuestion.fillQuestion.length // 获取下划线的数量
    console.log('props:', this.qusetionData)
    this.qusetionData.tpqScore = this.qusetionData.tpqQuestion.fillQuestion.reduce((sum, item) => sum + item.fillQuestionScore[0].fqsScore, 0)
  },
  watch: {
    'qusetionData.tpqQuestion.questionTitle' (newV, oldV) {
      this.len = newV.split('▁') // 查找下划线截取数据
    }
  },
  computed: {
    lessHtml () {
      // 插入填空逻辑
      let text = this.qusetionData.tpqQuestion.questionTitle
      this.newNum = text.split('▁').length - 1
      const len = text.slice(0, this.inputChangeIndex).split('▁').length - 1
      if (this.newNum > this.oldNum) {
        for (let i = 0; i < this.newNum - this.oldNum; i++) {
          this.qusetionData.tpqQuestion.fillQuestion.splice(
            len - this.newNum + this.oldNum,
            0,
            {
              fqAnswer: '',
              fillQuestionScore: [{ fqsScore: 1 }]
            }
          )
        }
      } else if (this.newNum < this.oldNum) {
        this.qusetionData.tpqQuestion.fillQuestion.splice(
          len,
          this.oldNum - this.newNum
        )
      }
      this.oldNum = this.newNum

      for (let i = 0; i < this.newNum; i++) {
        text = text.replace(
          '▁',
          ` <span style='padding:2px 35px;border-bottom: 1px solid black;' >${this.qusetionData.tpqQuestion.fillQuestion[i].fqAnswer}</span>(${this.qusetionData.tpqQuestion.fillQuestion[i].fillQuestionScore[0].fqsScore}分) `
        )
      }
      return text
    }
  },
  methods: {
    /** 插入填空 */
    addValue () {
      this.$refs.questionTitle.focus()
      document.execCommand('insertText', true, '▁')
    },
    /** input change事件 */
    changeInput (e) {
      this.inputChangeIndex = event.target.selectionEnd
    },
    /** 切换布局事件 */
    switchBox () {
      this.balBool = !this.balBool
    },
    /** 点击取消 */
    switchBoxElse () {
      this.qusetionData.tpqQuestion = JSON.parse(JSON.stringify(this.qusetionDataClone.tpqQuestion))
      this.oldNum = this.qusetionDataClone.tpqQuestion.fillQuestion.length
      this.switchBox()
    },
    /** 修改分数 */
    handleChange (index) {
      const data = {
        tpqId: this.qusetionData.tpqId,
        tpqScore: this.qusetionData.tpqScore,
        fillQuestionScore: []
      }
      this.qusetionData.tpqQuestion.fillQuestion.forEach(item => {
        console.log(item.fillQuestionScore[0])
        data.fillQuestionScore.push(item.fillQuestionScore[0])
      })
      data.tpqScore = data.fillQuestionScore.reduce(
        (sum, item) => sum + item.fqsScore,
        0
      )
      Api.ModifyScore(data).then(res => {
        switch (res.data.code) {
          case 1:
            this.qusetionDataClone.tpqQuestion.fillQuestion[index].fillQuestionScore[0].fqsScore = this.qusetionData.tpqQuestion.fillQuestion[index].fillQuestionScore[0].fqsScore
            this.qusetionData.tpqScore = this.qusetionData.tpqQuestion.fillQuestion.reduce((sum, item) => sum + item.fillQuestionScore[0].fqsScore, 0)
            this.$message({ message: res.data.message, type: 'success' })
            break
          default:
            this.$message({ message: res.data.message, type: 'warning' })
        }
      })
    },
    /** 删除题目 */
    deleteQuestion () {
      Api.RemoveQuestionFromTestPaper({
        paperQuestionId: this.qusetionData.tpqId
      }).then(res => {
        switch (res.data.code) {
          case 1:
            this.$emit('deleteQuestion', this.qusetionData.tpqId)
            this.$message({ message: res.data.message, type: 'success' })
            break
          default:
            this.$message({ message: res.data.message, type: 'warning' })
        }
      })
    },
    /** 保存修改 */
    submitTitle () {
      if (this.qusetionData.tpqQuestion.questionTitle.trim() === '') {
        this.$message({ message: '未填写题干', type: 'warning' })
        return this.$refs.questionTitle.focus()
      }
      /** 是否添加题目 */
      if (this.qusetionData.tpqQuestion.fillQuestion.length === 0) {
        this.$message({ message: '未添加题目', type: 'warning' })
        return this.$refs.questionTitle.focus()
      }
      for (const i in this.qusetionData.tpqQuestion.fillQuestion) {
        if (
          this.qusetionData.tpqQuestion.fillQuestion[i].fqAnswer.trim() === ''
        ) {
          this.$message({ message: '答案不能为空', type: 'warning' })
          return
        }
      }
      const paperQuestionId = this.qusetionData.tpqId
      const data = {
        questionId: this.qusetionData.tpqQuestion.questionId,
        questionTitle: this.qusetionData.tpqQuestion.questionTitle,
        questionTypeId: 2,
        fillQuestion: []
      }
      // 循环添加数据
      this.qusetionData.tpqQuestion.fillQuestion.forEach((item, index) => {
        data.fillQuestion.push({
          fqId: item.fqId,
          fqAnswer: item.fqAnswer,
          fqOrder: index + 1
        })
      })
      Api.ModifyQuestion(data, paperQuestionId).then(res => {
        switch (res.data.code) {
          case 1:
            res.data.data.fillQuestion = JSON.parse(JSON.stringify(res.data.data.fillQuestion.sort((a, b) => a.fqOrder - b.fqOrder)))
            // this.qusetionData.tpqQuestion = res.data.data

            this.qusetionData.tpqQuestion = res.data.data
            this.qusetionData.tpqScore = this.qusetionData.tpqQuestion.fillQuestion.reduce((sum, item) => sum + item.fillQuestionScore[0].fqsScore, 0)

            this.qusetionDataClone = JSON.parse(
              JSON.stringify(this.qusetionData)
            )
            this.switchBox()
            this.$message({ message: res.data.message, type: 'success' })
            break
          default:
            this.$message({ message: res.data.message, type: 'warning' })
        }
      })
    }
  },
  // components: { RichTextBox }
}
</script>

<style lang="less" scoped>
#ModifyBlank {
  padding: 10px 0;
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
  .itemspan {
    padding: 2px 15px;
    margin: 0px 4px;
    border-bottom: 1px solid black;
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

  .enum {
    margin-top: 15px;
  }
  .el-button.is-circle {
    padding: 8px;
  }
  .one .el-input {
    width: calc(100% - 150px);
    margin-right: 12.5px;
  }
  .el-form-item__content .el-button.is-round {
    padding: 7px 15px;
  }
  .boxspan {
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
