<template>
  <div>
    <div class="boxImg">
      <img class="img" src="../assets/404.png" alt />
    </div>
    <div style="text-align:center;">
      <el-button @click="$router.go(-1)" type="primary">返回</el-button>
      <div>{{this.time}}秒后将自动返回</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time:10
    }
  },
  mounted() {
    this.outPaper()
  },
  methods: {
    outPaper(){
      let keepTime = setInterval(()=>{
        if(this.time===0) {
          clearInterval(keepTime)
          this.$message({ message: `跳转中……`,type: 'success',duration:600 });
          setTimeout(()=>{
            this.$router.go(-1)
          },500)
        }
        this.time--
      },1000)
    }
  },
}
</script>

<style lang="less" scoped >
  .boxImg{
    max-width: 80%;
  }
</style>