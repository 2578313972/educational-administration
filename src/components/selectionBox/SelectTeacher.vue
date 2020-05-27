<!--
*使用方法
  <Select-Teacher v-model="这里传入一个对象" />
-->
<template>
    <div id="SelectTeacher">
        <el-select v-model="value.userId" placeholder="请选择">
            <el-option label="请选择" value="0"></el-option>
            <el-option v-for="item in allTeacher" :key="item.userTypeId" :label="item.userName" :value="item.userId"></el-option>
        </el-select>
    </div>
</template>

<script>
import Api from '@/http/FClass'
export default {
  data () {
    return {
      allTeacher: []
    }
  },
  props: {
    value: {
      userName: String,
      userId: String
    }
  },
  created () {
    Api.GetTeachers().then(res => {
      this.allTeacher = res.data
    })
  },
  watch: {
    value: {
      handler: function (newVal, oldVal) {
        try {
          this.value.userName = this.allTeacher.find(item => item.userId === this.value.userId).userName
        } catch {}
        this.$emit('input', this.value)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
    #SelectTeacher{
        box-sizing: border-box;
        .el-select{width:100%;}
    }
</style>
