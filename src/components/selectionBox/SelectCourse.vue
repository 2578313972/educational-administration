<template>
  <div id="SelectCourse">
    <el-select v-model="value.courseId" ref="selectCourse" placeholder="请选择课程">
      <el-option label="请选择课程" value="0"></el-option>
      <el-option
        v-for="item in allCourse"
        :key="item.userTypeId"
        :label="item.courseName"
        :value="item.courseId"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import Api from '@/http/FClass'
export default {
  data () {
    return {
      allCourse: []
    }
  },
  props: ['value'],
  created () {
    Api.GetAllCourse().then(res => {
      this.allCourse = res.data
    })
  },
  watch: {
    'value.courseId': {
      handler: function (newVal, oldVal) {
        try {
          this.value.courseName = this.allCourse.find(
            item => item.courseId === this.value.courseId
          ).courseName
        } catch {}
        this.$emit('input', this.value)
      },
      deep: true
    }
  },
  methods: {
    bindFocus () {
      this.$refs.selectCourse.focus()
    }
  }
}
</script>

<style lang="less" scoped>
#SelectCourse {
  box-sizing: border-box;
  .el-select {
    width: 100%;
  }
}
</style>
