<template>
  <div id="BReadOver">
    <h3>测试任务列表</h3>
    <el-divider></el-divider>
    <el-table border :data="tableData" style="width: 100%">
      <el-table-column label="#" min-width="45">
        <template slot-scope="scope">{{scope.$index+1+(pageIndex-1)*pageSize}}</template>
      </el-table-column>
      <el-table-column prop="tpTitle" label="试卷名" width="120"></el-table-column>
      <el-table-column prop="className" label="班级" width="100"></el-table-column>
      <el-table-column prop="userName" label="出卷人" width="100"></el-table-column>
      <el-table-column label="测试开始时间" min-width="160">
        <template slot-scope="scope">{{scope.row.taskStartTime.split("T").join(" ").split(".")[0]}}</template>
      </el-table-column>
      <el-table-column label="测试结束时间" min-width="160">
        <template slot-scope="scope">{{scope.row.taskEndTime.split("T").join(" ").split(".")[0]}}</template>
      </el-table-column>
      <el-table-column prop="taskEscapeTime" label="耗时（分钟）" width="110"></el-table-column>
      <el-table-column prop="counter" label="交卷人数" width="80"></el-table-column>
      <el-table-column label="操作" width="110">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="!scope.row.counter?true:false"
            @click="handleEdit(scope.$index, scope.row)"
            type="primary"
          >批阅试卷</el-button>
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
  </div>
</template>

<script>
import Api from '@/http/BReadover'

export default {
  data () {
    return {
      tableData: [], // 渲染table数据
      total: 0, // 总数据
      pageIndex: 1, // 第几页
      pageSize: 10 // 每页多少数据
    }
  },
  created () {
    this.getPaperData()
  },
  methods: {
    /** 批阅试卷 */
    handleEdit (index, row) {
      console.log(index, row)
      this.$router.push(`/BReadoverZJ?paperId=${row.taskId}`)
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
    }
  }
}
</script>

<style lang="less">
#BReadOver {
  .el-pagination {
    margin-top: 15px;
    text-align: center;
  }
}
</style>
