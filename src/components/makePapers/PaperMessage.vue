<template>
    <div id="PaperMessage">
        <el-form :model="fromPaperName" label-position="top" status-icon :rules="fromPaperRules" ref="ruleForm" class="demo-ruleForm">
            <el-form-item label="试卷名称" prop="name" >
                <el-input v-model="fromPaperName.name" autofocus ref="name"  placeholder="请试卷名称"></el-input>
            </el-form-item>
            <el-form-item label="课程名称" >
                <Select-Course  v-model="paperCourse" ref="selectCourse" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')" >下一步</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import SelectCourse from 'select/SelectCourse' // 组件
import Api from '@/http/BMakePaper' // API接口
export default {
  data () {
    var fromPaperFrom = (rule, value, callback) => {
      if (!value) return callback(new Error('试卷名称不能为空'))
      callback()
    }
    return {
      paperCourse: { courseId: '0', courseName: '' }, // v-model的传入值
      fromPaperName: {
        /** */
        name: '',
        selectCourse: ''
      },
      fromPaperRules: {
        name: [{ validator: fromPaperFrom, required: true, trigger: 'blur' }]
      }
    }
  },
  watch: {
    'paperCourse.courseId' (newV) { // 监听获取到的值
      this.fromPaperName.selectCourse = this.paperCourse.courseId
    }
  },
  methods: {
    submitForm (formName) {
      if (!this.fromPaperName.name) return this.$refs.name.focus()
      if (this.paperCourse.courseId === '0') return this.$refs.selectCourse.$refs.selectCourse.focus()
      const uid = this.$store.state.userData.userUid // 老师编号
      Api.MakeTestPaper({
        uid,
        paper: { tpTitle: this.fromPaperName.name, tpCourseId: this.fromPaperName.selectCourse }
      }).then(res => {
        switch (res.data.code) {
          case 1:
            sessionStorage.setItem('testPaperId', res.data.data.testPaperId) // 保存试卷编号
            this.$message({ message: '试卷添加成功', type: 'success' })
            this.$emit('next', res.data.data.testPaperId) // 在父组件调用方法
            break
          default:
            this.$message({ message: res.data.message, type: 'warning' })
        }
      })
    }
  },
  components: { SelectCourse }
}
</script>

<style lang="less" scoped>
    #PaperMessage{
        .el-form.el-form--label-top{
            /** */
            width: 50%;
            max-width: 450px;
            margin: auto;
            .el-form-item__content{margin-top: 0px !important;}
            .el-select{width:100%;}
            /deep/ .el-form-item__content{
                text-align: center;
            }
        }
    }
</style>
