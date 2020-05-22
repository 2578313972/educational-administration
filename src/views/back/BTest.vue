<template>
  <div id="BTest">
    <div class="box">
      <el-card class="box-card one">
        <div slot="header" class="clearfix">
          <select-class ref="calssId" v-model="comSelectClass" />
        </div>
        <div class="text item">
          <el-table @cell-click="cellClick" :data="tableData" style="width: 100%">
            <el-table-column align="center" min-width="100px" prop="courseName" label="课程"></el-table-column>
            <el-table-column align="center" width="100px" prop="tpTitle" label="试卷"></el-table-column>
            <el-table-column align="center" min-width="100px" prop="date" label="日期"></el-table-column>
            <el-table-column align="center" width="80px" prop="counter" label="提交人数"></el-table-column>
          </el-table>
        </div>
      </el-card>

      <el-card class="box-card two">
        <div slot="header" class="clearfix">
          <el-radio-group style="margin-right:10px;" v-model="radio" @change="changeRadio">
            <el-radio :label="1">列表</el-radio>
            <el-radio :label="2">图表</el-radio>
          </el-radio-group>
          <el-button size="small" type="primary" :loading="excelOutBool" @click="excelOut">导出</el-button>
          <el-button size="small" type="primary" v-print="'#printDiv'">打印</el-button>
        </div>
        <div class="text item" id="printDiv">
          <div v-show="radio===1" class="box_1">
            <h4 style="text-align: center;margin:10px 0 0 0;">{{title}}</h4>
            <el-table :data="tableData_2" style="width: 100%">
              <el-table-column label="#" type="index" min-width="30"></el-table-column>
              <el-table-column align="center" min-width="80" prop="stuName" label="姓名"></el-table-column>
              <el-table-column align="center" min-width="100" prop="testScore" label="成绩"></el-table-column>
              <el-table-column align="center" min-width="100" prop="submitTime" label="提交时间"></el-table-column>
              <el-table-column align="center" min-width="80" prop="userName" label="阅卷老师"></el-table-column>
            </el-table>
          </div>

          <div ref="munWid" v-show="radio===2">
            <v-chart v-show="radio===2&&option.title.text" :options="option" />
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import Api from "@/http/BTest";
import SelectClass from "@/components/selectionBox/SelectClass";
import { export2Excel } from '@/common/js/util'

import ECharts from 'vue-echarts'
// // 手动引入 ECharts 各模块来减小打包体积
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title.js'

export default {
  data() {
    return {
      title: "", // 班级名称
      tableData: [], // 试卷数据
      tableData_2: [], // 学生成绩数据
      comSelectClass: { classId: "0", className: "" }, // 下拉组件 传值
      excelOutBool:false, // 导出加载
      radio: 1, // 单选按钮
      option: { // echarts 数据
        color: ['#3398DB'],
        title: {
          text: "",
          textStyle: {
            fontSize: 16,
            fontFamily: "Courier New"
          },
          left: "center"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "left",
          top: "50",
          width: "auto",
          height: "auto",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            nameLocation : 'end',
            data: [],
            axisTick: { alignWithLabel: true }
          }
        ],
        yAxis: [{ type: "value" }],
        series: [
          {
            name: "成绩",
            type: "bar",
            barWidth: "50%",
            label: {
              show: true,
              position: "top"
            },
            data: [],
          }
        ]
      },
      excelTitle:[ // excel 表头
        {title:"#",key:"index"},
        {title:"姓名",key:"name"},
        {title:"成绩",key:"score"},
        {title:"提交时间",key:"time"},
        {title:"阅卷老师",key:"teacther"},
      ],
      exceldata:[] // excel 内容
    };
  },
  watch: {
    "comSelectClass.classId"(newV) {
      if (newV !== "0") {
        Api.GetTestPaperByClassId({ classId: newV }).then(res => {
          this.tableData = res.data.filter(item => item.counter);
        });
      }else{
        this.tableData = []
        this.tableData_2 = []
        this.option.title.text = ''
      }
    }
  },
  methods: {
    /** 点击试卷事件 */
    cellClick(e) {
      this.title = e.courseName;
      Api.GetTestResultByTaskId({ taskId: e.taskId }).then(res => {
        this.tableData_2 = res.data;
        // 将值传给 echarts option
        // this.option.xAxis[0].data = res.data.map(item => item.stuName);
        this.option.series[0].data = res.data.map(item => item.testScore);

        let arr = []
        res.data.forEach((item,index)=>{
          if(index%2===0){
            arr.push({value:item.stuName})
          }else{
            arr.push({value:'\n'+item.stuName})
          }
        })
        this.option.xAxis[0].data = arr

        this.option.title.text = e.tpTitle+'（成绩表）';
        this.option.title.left = this.$refs.munWid.clientWidth / 2 - (this.option.title.text.length * this.option.title.textStyle.fontSize) / 2;
      });
    },
    /** 改变单选按钮时 触发响应事件 */
    changeRadio() {
      this.reSizeMedia();
      window.onresize = () => this.reSizeMedia();
    },
    /** 窗口响应事件 */
    reSizeMedia() {
      if(!this.$refs.munWid) return
      this.option.grid.width = this.$refs.munWid.clientWidth;
      this.option.title.left = this.$refs.munWid.clientWidth / 2 - (this.option.title.text.length * this.option.title.textStyle.fontSize) / 2;
    },
    /** 导出 */
    excelOut(){
      if(this.tableData_2.length === 0) return this.$message({ type: "warning", message: '暂时没有数据！' })
      this.excelOutBool = !this.excelOutBool
      setTimeout(()=>{
        this.excelOutBool = !this.excelOutBool
      },5000)
      this.tableData_2.forEach((item,index)=>{
        this.exceldata.push({index:index+1,name:item.stuName,score:item.testScore,time:item.submitTime,teacther:item.userName})
      })
      export2Excel(this.excelTitle,this.exceldata)
    },
  },
  components: { SelectClass,'v-chart':ECharts }
};
</script>

<style lang="less">
#BTest {
  .box {
    display: flex;
    justify-content: space-between;
    .box-card {
      width: 48%;
    }
  }
}
</style>