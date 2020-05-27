<template>
  <div id="SelectPaper">
    <el-select ref="paperId" v-model="userData.tpId" placeholder="试卷选择">
      <el-option label="请选择试卷" value='-1'></el-option>
      <el-option v-for="item in allData" :key="item.tpId" :label="item.tpTitle" :value="item.tpId"></el-option>
    </el-select>
  </div>
</template>

<script>
import Api from '@/http/BPaper'
export default {
  data () {
    return {
      userData: {},
      allData: [] // 选择框所有数据
    }
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  created () {
    Api.GetAllTestPaper().then(res => {
      this.allData = res.data
      this.userData = this.value
    })
  },
  watch: {
    'value.tpId' (newV) {
      if (newV !== '-1') {
        this.userData.tpTitle = this.allData.find(
          item => item.tpId === newV
        ).tpTitle
      }
      this.$emit('input', this.userData)
    }
  }
}
</script>

<style lang="less" scoped>
#SelectPaper {
  box-sizing: border-box;
  .el-select {
    width: 100%;
  }
}
</style>
