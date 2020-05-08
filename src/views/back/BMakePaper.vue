<template>
    <div id="BTeacher">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-steps :active="active" align-center finish-status="success">
                    <el-step title="试卷信息"></el-step>
                    <el-step title="添加题目"></el-step>
                    <el-step title="完成制作"></el-step>
                </el-steps>
            </div>
            <div class="text item">
                <Paper-Message @next="choiceNext" v-if="active===0" />
                <Paper-AddTitle :testPaperId="testPaperId" v-if="active===1"  />
                <Paper-Complete v-if="active===3"  />
            </div>
        </el-card>
    </div>
</template>

<script>
import PaperMessage from '@/components/makePapers/PaperMessage'
import PaperAddTitle from '@/components/makePapers/PaperAddTitle'
import PaperComplete from '@/components/makePapers/PaperComplete'
export default {
    data() {
        return {
            active: 0, // 步骤位置
            testPaperId:""
        }
    },
    created() {
        if(sessionStorage.getItem('testPaperId')){
            this.active = 1
        }
    },
    methods: {
        next(id) {

            /**跳转至下一步操作 */
            if(this.active==1)return this.active+=2
            if (this.active++ > 2) this.active = 0;
        },
        choiceNext(id){
            console.log(id);
            this.testPaperId = id
            ++this.active
        }
    },
    components:{PaperMessage,PaperAddTitle,PaperComplete}
}
</script>

<style lang="less" scoped>
    #BTeacher{
        /**
        * 上半部分
        */
        .el-card__header{
            box-sizing: border-box;
            padding: 20px 0;
            .el-steps{
                width: 75%;
                margin: auto;
            }
        }

        /**
        * 下半部分
        */

    }
</style>