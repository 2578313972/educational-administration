<template>
  <div id="BArrange">
    <div class="top">
      <el-form ref="form" :model="paperData" label-width="80px">
        <el-form-item label="试卷">
          <select-paper ref="paperId" v-model="comSelectPaper" />
        </el-form-item>
        <el-form-item label="班级">
          <select-class ref="calssId" v-model="comSelectClass" />
        </el-form-item>
        <el-form-item label="考试时间">
          <div class="block">
            <el-date-picker
              ref="timeValue"
              v-model="timeValue"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @focus="startTime"
              @blur="endTime"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item v-if="timeScore">
          <el-button
            style="transform: translateY(-20px);"
            size="small"
            disabled
            type="danger"
            plain
          >用时{{timeScore}}分钟</el-button>
        </el-form-item>
        <el-form-item label>
          <el-button size="small" round @click="kon">取消</el-button>
          <el-button size="small" type="primary" round @click="setTest">设置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-divider></el-divider>
    <el-table border :data="tableData" style="width: 100%">
      <el-table-column label="#" min-width="58">
        <template slot-scope="scope">{{scope.$index+1+(pageIndex-1)*pageSize}}</template>
      </el-table-column>
      <el-table-column prop="tpTitle" label="试卷名" width="120"></el-table-column>
      <el-table-column prop="className" label="班级" width="100"></el-table-column>
      <el-table-column prop="userName" label="出卷人" width="100"></el-table-column>
      <el-table-column label="测试开始时间" min-width="160">
        <template slot-scope="scope">{{scope.row.taskStartTime | time}}</template>
      </el-table-column>
      <el-table-column label="测试结束时间" min-width="160">
        <template slot-scope="scope">{{scope.row.taskEndTime | time}}</template>
      </el-table-column>
      <el-table-column prop="taskEscapeTime" label="耗时（分钟）" width="110"></el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="scope.row.counter?true:false"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            :disabled="scope.row.counter?true:false"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[2, 10, 25, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <el-dialog
      @close="close('ruleForm')"
      title="修改测试任务"
      :visible.sync="centerDialogVisible"
      width="35%"
      center
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="试卷">
          <select-paper ref="paperId_2" v-model="comSelectPaper_2" />
        </el-form-item>
        <el-form-item label="班级">
          <select-class ref="calssId_2" v-model="comSelectClass_2" />
        </el-form-item>
        <el-form-item label="考试时间">
          <div class="block">
            <el-date-picker
              ref="timeValue_2"
              v-model="timeValue_2"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @blur="blurDate"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            style="transform: translateY(-20px);"
            size="small"
            disabled
            type="danger"
            plain
          >用时{{timeScore_2}}分钟</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modification('ruleForm')">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Api from '@/http/BArrange'

import TimeOut from '@/plug-in/TimeOut'

import SelectClass from 'select/SelectClass'
import SelectPaper from 'select/SelectPaper'
export default {
  data () {
    return {
      paperData: {
        taskTestPaperId: '-1', // 试卷编号
        taskClassId: '0', // 班级编号
        taskStartTime: '', // 开始时间
        taskEndTime: '' // 结束时间
      },
      ruleForm: {
        taskId: 0, // 主键编号
        taskTestPaperId: '-1', // 试卷编号
        taskClassId: '0', // 班级编号，可修改
        taskStartTime: '', // 测试开始时间，可修改
        taskEndTime: '' // 测试结束时间，可修改
      },
      centerDialogVisible: false, // 控制新增弹框
      tableData: [], // 渲染table数据
      comSelectClass: { classId: '0', className: '' }, // 选择班级
      comSelectPaper: { tpId: '-1', tpTitle: '' }, // 选择试卷
      comSelectClass_2: { classId: '0', className: '' }, // 选择班级
      comSelectPaper_2: { tpId: '-1', tpTitle: '' }, // 选择试卷
      timeValue: [], // 获取时间数组_1
      timeValue_2: [], // 获取时间数组_2
      total: 0, // 总数据
      pageIndex: 1, // 第几页
      pageSize: 10, // 每页多少数据
      timeScore: 0, // 考试所需时间_1
      timeScore_2: 0, // 考试所需时间_2
      rules: {
        /** 弹框验证 */
        paperTitle: [
          { required: true, message: '请输入班级名称', trigger: 'blur' }
        ],
        courseName: [
          { required: true, message: '请选择专业名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getPaperData()
  },
  watch: {
    'comSelectClass.classId' (newV) {
      // 班级——1
      this.paperData.taskClassId = newV
    },
    'comSelectPaper.tpId' (newV) {
      // 试卷——1
      this.paperData.taskTestPaperId = newV
    },
    'comSelectClass_2.classId' (newV) {
      // 班级——2
      this.ruleForm.taskClassId = newV
    },
    'comSelectPaper_2.tpId' (newV) {
      // 试卷——2
      this.ruleForm.taskTestPaperId = newV
    }
  },
  methods: {
    /** 获取时间选择器焦点 */
    startTime () {
      this.timeValue = []
      const time = new Date()
      this.timeValue[0] = time
      this.timeValue[1] = new Date(
        time.getFullYear(),
        time.getMonth(),
        time.getDate(),
        time.getHours() + 1,
        time.getMinutes(),
        time.getUTCSeconds()
      )
    },
    /** 设置 */
    setTest () {
      // 非空验证
      if (this.paperData.taskTestPaperId === '-1') {
        this.$refs.paperId.$refs.paperId.focus()
        this.$message({ type: 'info', message: '请选择试卷' })
        return
      }
      // 非空验证
      if (this.paperData.taskClassId === '0') {
        this.$refs.calssId.$refs.calssId.focus()
        this.$message({ type: 'info', message: '请选择班级' })
        return
      }
      // 非空验证
      if (!this.timeValue || this.timeValue.length < 1) {
        this.$refs.timeValue.focus()
        this.$message({ type: 'info', message: '请选择考试时间' })
        return
      }

      this.timeValue[0].setHours(this.timeValue[0].getHours() + 8)
      this.timeValue[1].setHours(this.timeValue[1].getHours() + 8);

      [
        this.paperData.taskStartTime,
        this.paperData.taskEndTime
      ] = this.timeValue
      // this.paperData.taskStartTime = this.paperData.taskStartTime.toLocaleDateString().split("/")
      // this.paperData.taskEndTime = this.paperData.taskStartTime.toLocaleDateString()

      Api.SetTest({
        uid: this.$store.state.userData.userUid,
        data: this.paperData
      }).then(res => {
        switch (res.data.code) {
          case 1:
            this.kon()
            this.getPaperData(this.pageIndex, this.pageSize)
            this.$message({ type: 'success', message: res.data.message })
            break
          default:
            this.$message({ type: 'info', message: res.data.message })
            break
        }
      })
    },
    /** 点击编辑 */
    handleEdit (index, data) {
      this.centerDialogVisible = true
      this.ruleForm.taskId = data.taskId // 编号
      this.selectData = data
      this.selectIndex = index //  修改时需要用到的下标
      // -------------------  组件传值
      this.comSelectPaper_2.tpId = data.taskTestPaperId
      this.comSelectPaper_2.tpTitle = data.tpTitle
      this.comSelectClass_2.classId = data.classId
      this.comSelectClass_2.className = data.className
      // -------------------
      this.timeValue_2[0] = data.taskStartTime // 保存开始时间
      this.timeValue_2[1] = data.taskEndTime // 保存结算时间

      this.timeScore_2 = data.taskEscapeTime

      this.ruleForm.taskStartTime = data.taskStartTime
      this.ruleForm.taskEndTime = data.taskEndTime
    },
    /** 修改 */
    modification () {
      // 非空验证
      if (this.ruleForm.taskTestPaperId === '-1') {
        this.$refs.paperId_2.$refs.paperId.focus()
        this.$message({ type: 'info', message: '请选择试卷' })
        return
      }
      // 非空验证
      if (this.ruleForm.taskClassId === '0') {
        this.$refs.calssId_2.$refs.calssId.focus()
        this.$message({ type: 'info', message: '请选择班级' })
        return
      }
      // 非空验证
      if (!this.timeValue_2) {
        this.$refs.timeValue_2.focus()
        this.$message({ type: 'info', message: '请选择考试时间' })
        return
      }

      this.timeValue_2[0].setHours(this.timeValue_2[0].getHours() + 8)
      this.timeValue_2[1].setHours(this.timeValue_2[1].getHours() + 8)

      this.ruleForm.taskStartTime = this.timeValue_2[0]
      this.ruleForm.taskEndTime = this.timeValue_2[1]
      Api.ModifyTestTask(this.ruleForm).then(res => {
        switch (res.data.code) {
          case 1:
            const item = this.tableData[this.selectIndex] // 需要操作的数据
            // 赋值操作

            item.classId = this.comSelectClass_2.classId
            item.className = this.comSelectClass_2.className;
            [item.taskStartTime, item.taskEndTime] = this.timeValue_2
            item.taskTestPaperId = this.comSelectPaper_2.tpId
            item.tpTitle = this.comSelectPaper_2.tpTitle

            try {
              item.taskEscapeTime =
                (this.ruleForm.taskEndTime.getTime() -
                  this.ruleForm.taskStartTime.getTime()) /
                60000
            } catch (error) {}
            this.centerDialogVisible = false
            this.$message({ type: 'success', message: res.data.message })
            break
          default:
            this.$message({ type: 'warning', message: res.data.message })
            break
        }
      })
    },
    /** 删除 */
    handleDelete (index, data) {
      this.$confirm('此操作将永久删除试卷, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Api.RemoveTestTask({ taskId: data.taskId }).then(res => {
            switch (res.data.code) {
              case 1:
                this.getPaperData(this.pageIndex, this.pageSize) // 重新掉接口排序
                this.$message({ type: 'success', message: res.data.message })
                break
              default:
                this.$message({ type: 'info', message: res.data.message })
                break
            }
          })
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消删除' })
        })
    },
    endTime () {
      if (this.timeValue === null) return (this.timeScore = 0)
      this.timeScore = Math.round((this.timeValue[1].getTime() - this.timeValue[0].getTime()) / 60000)
    },
    /** 计算考试时间 */
    blurDate () {
      if (this.timeValue_2 === null) return (this.timeScore_2 = 0)
      try {
        this.timeScore_2 =
          (this.timeValue_2[1].getTime() - this.timeValue_2[0].getTime()) /
          60000
      } catch (error) {
        this.timeScore_2 = this.selectData.taskEscapeTime
      }
    },
    /** 每页多少条数据 */
    handleSizeChange (val) {
      this.pageSize = val
      this.getPaperData(this.pageIndex, this.pageSize)
    },
    /** 第几页数据 */
    handleCurrentChange (val) {
      this.pageIndex = val
      this.getPaperData(this.pageIndex, this.pageSize)
    },
    /** 获取渲染数据 */
    getPaperData (pageIndex, pageSize) {
      Api.GetTestTask({ pageIndex, pageSize }).then(res => {
        this.tableData = res.data.data
        this.total = res.data.items
      })
    },
    /** 清除添加选项 */
    kon () {
      this.comSelectClass.classId = '0'
      this.comSelectPaper.tpId = '-1'
      this.timeValue = []
      this.paperData = {
        taskTestPaperId: '-1', // 试卷编号
        taskClassId: '0', // 班级编号
        taskStartTime: '', // 开始时间
        taskEndTime: '' // 结束时间
      }
      this.timeScore = 0
    },
    /** 关闭弹出窗口回调 */
    close (formName) {
      this.$refs[formName].resetFields()
    }
  },
  filters: {
    // 过滤器
    time (val) {
      return new Date(val).toLocaleDateString().replace(/\//g, '-')
    }
  },
  components: { SelectClass, SelectPaper }
}
</script>

<style lang="less">
#BArrange {
  .top {
    min-width: 500px;
    width: 50%;
  }
  .el-date-editor--datetimerange.el-input,
  .el-date-editor--datetimerange.el-input__inner {
    width: 100%;
  }
  .el-pagination {
    margin-top: 15px;
    text-align: center;
  }
  .el-dialog--center {
    min-width: 540px;
  }
}
</style>
