<template>
  <div id="BReadoverZJ"></div>
</template>

<script>
import Api from "@/http/BReadover";

export default {
  data() {
    return {};
  },
  created() {
    Api.GetStudentTest({ taskId: this.$route.query.paperId }).then(res => {
      console.log(res);
    });
  }
};
</script>