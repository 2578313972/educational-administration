<template>
    <div>
        <PaperComplete :allPaperData="allPaperData" />
        <PaperAddTitle :testPaperId="testPaperId" :allQuestions="allPaperData.questions" />
    </div>
</template>

<script>
import Api from "@/http/BPaper";
import PaperAddTitle from "@/components/makePapers/PaperAddTitle";
import PaperComplete from "@/components/makePapers/PaperComplete";
export default {
    data() {
        return {
            allPaperData:{questions:[]},
            testPaperId:0
        }
    },
    created() {
      Api.GetTestPaper({ id: this.$route.query.id }).then(res => {
        this.testPaperId = res.data.tpId;
        this.allPaperData = res.data;
      });
    },
    components:{ PaperComplete,PaperAddTitle}
}
</script>
