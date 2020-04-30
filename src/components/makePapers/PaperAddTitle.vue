<template>
    <div id="PaperAddTitle">
        <el-card class="box-card">
            <div slot="header" class="clearfix">

                <span style="margin-right:6px;">题目类型</span>
                <el-radio-group v-model="radio">
                    <el-radio :label="1">选择题</el-radio>
                    <el-radio :label="2">填空题</el-radio>
                    <el-radio :label="3">问答题</el-radio>
                </el-radio-group>
                <el-button style="float: right; padding: 6px;" type="primary">操作按钮</el-button>

            </div>
            <div  class="text item">
                <PaperChoiceQuestion v-show="radio===1" />
                <PaperBlanksTest v-show="radio===2" />
                <PaperEssayQuestion v-show="radio===3" />
            </div>
        </el-card>

        <el-card class="box-card cardbox">
            <div slot="header" class="clearfix">
                <span>一、选择题（本题共0道小题，共0/0分）</span>
            </div>
            <div class="text item">

            </div>
        </el-card>

        <el-card class="box-card cardbox">
            <div slot="header" class="clearfix">
                <span>二、填空题（本题共0道小题，共0/0分）</span>
            </div>
            <div class="text item">

            </div>
        </el-card>

        <el-card class="box-card cardbox">
            <div slot="header" class="clearfix">
                <span>三、问答题（本题共0道小题，共0/0分）</span>
            </div>
            <div class="text item">

            </div>
        </el-card>
    </div>
</template>

<script>
import PaperChoiceQuestion from '../../components/makePapers/subject/PaperChoiceQuestion'
import PaperBlanksTest from '../../components/makePapers/subject/PaperBlanksTest'
import PaperEssayQuestion from '../../components/makePapers/subject/PaperEssayQuestion'

export default {
    data() {
        return {
            radio:1
        }
    },
    components:{PaperChoiceQuestion,PaperBlanksTest,PaperEssayQuestion}
}
</script>

<style lang="less" scoped>
    #PaperAddTitle{
        margin:0;
        .cardbox{margin-top: 25px;}

    }
</style>