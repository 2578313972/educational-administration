<template>
  <div id="PaperChoiceQuestion">
    <el-form label-width="80px" ref="paperForm" :model="paperForm">
      <el-form-item label="题干">
        <el-input
          type="textarea"
          ref="textarea"
          autosize
          autofocus
          placeholder="请输入内容"
          v-model="paperForm.textarea"
        ></el-input>
      </el-form-item>

      <el-form-item class="enum" v-for="(item, index) in paperForm.data" :key="item.serial">
        <el-checkbox slot="label" v-model="item.tar">{{item.serial}}、</el-checkbox>
        <el-input class="paperbtn" :ref="'value'+index" v-model="item.value"></el-input>
        <el-button
          type="danger"
          icon="el-icon-delete"
          circle
          :disabled="paperForm.data.length>2?false:true"
          @click="deleteSer(index)"
        ></el-button>
      </el-form-item>

      <el-form-item label="分值">
        <el-input-number size="small" v-model="paperForm.num"></el-input-number>
      </el-form-item>

      <el-form-item class="btn">
        <el-button round @click="resetForm">重置</el-button>
        <el-button type="info" @click="addValue" round>新增选项</el-button>
        <el-button type="primary" @click="submitTitle" round>
          <span class="el-icon-document-checked"></span>保存题目
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Api from '@/http/BMakePaper'
export default {
  data () {
    return {
      usa: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      paperForm: {
        data: [], // 选项数据
        textarea: '', //　题干
        num: 2　// 分数
      }
    }
  },
  props: {
    testPaperId: [String, Number]
  },
  created () {
    this.paperForm.data = [ // 初始值数据
      { serial: 'A', tar: false, value: '' },
      { serial: 'B', tar: false, value: '' },
      { serial: 'C', tar: false, value: '' },
      { serial: 'D', tar: false, value: '' }
    ]
  },
  methods: {
    addValue () {
      /** 添加选项 */
      const serial = this.usa[this.paperForm.data.length]
      if (!serial) { return this.$message({ type: 'info', message: '已达最大上限' }) }
      this.paperForm.data.push({ serial, tar: false, value: '' })
    },
    deleteSer (index) {
      /** 删除选项并排序 */
      this.paperForm.data.splice(index, 1)
      for (let i = index; i < this.paperForm.data.length; i++) {
        this.paperForm.data[i].serial = this.usa[i]
      }
    },
    submitTitle () {
      /** 提交选择题 */
      this.SaveTraffic(500) /** 需要多少的间隔时间 不填写默认为1000毫秒 */
        .then(() => {
          let bool = true
          const againObj = {}
          const arrItem = this.paperForm.data
          if (!this.paperForm.textarea) {
            this.$refs.textarea.focus()
            this.$message({
              message: '题干不能为空。请输入题目',
              type: 'warning'
            })
            return
          }
          for (let i = 0, len = arrItem.length; i < len; i++) {
            if (!arrItem[i].value) {
              // 查找未填写答案的输入框
              this.$refs['value' + i][0].focus()
              this.$message({
                message: `${this.usa[i]}选项未填写答案。请输入答案`,
                type: 'warning'
              })
              return
            }
            if (againObj[arrItem[i].value]) {
              const oldIndex = Object.keys(againObj).indexOf(arrItem[i].value)
              this.$refs['value' + i][0].focus()
              this.$message({ message: `${this.usa[oldIndex]}选项与${this.usa[i]}选项出现重复答案,请重新填写`, type: 'warning' })
              return
            } else {
              againObj[arrItem[i].value] = arrItem[i].value
            }
            if (arrItem[i].tar === true) {
              // 检查是否有正确答案，如果没有则返回提示
              bool = false
            }
          }
          if (bool) {
            return this.$message({
              message: '没有选择答案,请选择',
              type: 'warning'
            })
          }
          const chooseQuestion = arrItem.map(item => {
            return { cqOption: item.value, cqIsRight: item.tar }
          }) // map映射导入数据
          const tpqPaperId = this.testPaperId || sessionStorage.getItem('testPaperId')

          Api.AddQuestionToTestPaper({
            tpqPaperId, // 试卷主键编号
            tpqScore: this.paperForm.num, // 分值
            tpqQuestion: {
              questionTitle: this.paperForm.textarea, // 题目的标题
              questionTypeId: 1, // 题目的类型 1=选择题 2=填空题 3=问答题
              chooseQuestion
            }
          }).then(res => {
            switch (res.data.code) {
              case 1:
                this.$emit('addQuestion', res.data.data)
                this.resetForm() // 调用重置表单函数
                this.$message({ message: res.data.message, type: 'success' })
                break
              default:
                this.$message({ message: res.data.message, type: 'warning' })
            }
          })
        })
        .catch(err => {
          // this.$message({ message: '操作过于频繁', type: "warning" });

        })
    },
    resetForm () {
      /** 重置表单 */
      this.paperForm = {
        data: [
          { serial: 'A', tar: false, value: '' },
          { serial: 'B', tar: false, value: '' },
          { serial: 'C', tar: false, value: '' },
          { serial: 'D', tar: false, value: '' }
        ],
        textarea: '',
        num: 2
      }
      this.$refs.paperForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
#PaperChoiceQuestion {
  .btn {
    margin-top: 15px;
  }
  /deep/ .el-input__inner{height:35px !important;}
  /deep/ .el-input--small .el-input__inner{height:32px !important;}
  .el-form-item{margin-bottom: 8px;}
  .el-button.is-circle{padding:8px;}
  .el-input {
    width: calc(100% - 50px);
    margin-right: 12.5px;
  }
  .el-form-item__content .el-button.is-round {
    padding: 7px 15px;
  }
}
</style>
