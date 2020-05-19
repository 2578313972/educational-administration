<template>
  <div id="SelectClass">
    <el-select ref="calssId" v-model="value.classId" placeholder="班级选择">
      <el-option label="请选择班级" value="0"></el-option>
      <el-option
        v-for="item in allClass"
        :key="item.classId"
        :label="item.className"
        :value="item.classId"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import Api from "@/http/FStudent";
export default {
  data() {
    return {
      allClass: [] // 选择框所有数据
    };
  },
  props: ["value"],
  created() {
    Api.GetAllClass().then(res => {
      this.allClass = res.data.map(item => ({
        classId: item.classId,
        className: item.className
      }));
    });
  },
  watch: {
    "value.classId"(newVal) {
      if (newVal !== "0") {
        this.value.className = this.allClass.find(
          item => item.classId === newVal
        ).className;
      }
      this.$emit("input", this.value);
    }
  }
};
</script>

<style lang="less" scoped>
#SelectClass {
  box-sizing: border-box;
  .el-select {
    width: 100%;
  }
}
</style>