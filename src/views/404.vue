<template>
  <div>
    <div>
      <img class="img" src="../assets/404.png" alt />
    </div>
    <p style="text-align:center;">
      <el-button @click="$router.go(-1)" type="primary">返回</el-button>
    </p>
  </div>
</template>