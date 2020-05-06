<template>
    <div id="PaperAddTitle">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="margin-right:6px;">题目类型</span>
                <div id="click">
                    <select-question-type v-model="radio" />
                </div>
                <el-button style="float: right; padding: 6px;" type="primary">操作按钮</el-button>
            </div>
            <div  class="text item">
                <paper-choice-question v-show="radio.typeId===1" />
                <paper-blanks-test v-show="radio.typeId===2" />
                <paper-essay-question v-show="radio.typeId===3" />
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
import SelectQuestionType from '@/components/selectionBox/SelectQuestionType' // 题目类型组件
import PaperChoiceQuestion from '@/components/makePapers/subject/PaperChoiceQuestion' // 选择题组件
import PaperBlanksTest from '@/components/makePapers/subject/PaperBlanksTest' // 填空题组件
import PaperEssayQuestion from '@/components/makePapers/subject/PaperEssayQuestion' // 问答题组件

export default {
    data() {
        return {
            radio:{typeId:"0",typeName:"",type:'click'}
        }
    },
    components:{ SelectQuestionType,PaperChoiceQuestion,PaperBlanksTest,PaperEssayQuestion }
}
</script>

<style lang="less" scoped>
    #PaperAddTitle{
        margin:0;
        .cardbox{margin-top: 25px;}
        #click{display: inline-block;width:calc(100% - 150px) !important;}
    }
</style>