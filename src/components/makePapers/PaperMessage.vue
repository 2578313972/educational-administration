<template>
    <div id="PaperMessage">
        <el-form :model="fromPaperName" label-position="top" status-icon :rules="fromPaperRules" ref="ruleForm" class="demo-ruleForm">
            <el-form-item label="试卷名称" prop="name" >
                <el-input v-model="fromPaperName.name"  placeholder="请试卷名称"></el-input>
            </el-form-item>
            <el-form-item label="课程名称" prop="selectCourse">
                <Select-Course v-model="PaperCourse" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')" >下一步</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import SelectCourse from '../selectionBox/SelectCourse'
export default {
    data() {
        var fromPaperFrom = (rule, value, callback) => {
            if (!value) return callback(new Error('试卷名称不能为空'));
            callback()
        };
        return {
            PaperCourse:{courseId:"",courseName:""},
            fromPaperName:{
                /** */
                name:"",
                selectCourse:""
            },
            fromPaperRules:{
                name: [{ validator: fromPaperFrom,required: true, trigger: 'blur' }],
                selectCourse: [{ required: true, message: '课程不能为空'}]
            },
        }
    },
    watch: {
        'PaperCourse.courseId'(newV){
            this.fromPaperName.selectCourse = this.PaperCourse.courseId
        }
    },
    methods: {
        next(){
            this.$emit('next')
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$emit("next")
                } else return false;
            });
        },
    },
    components:{SelectCourse}
}
</script>

<style lang="less" scoped>
    #PaperMessage{
        .el-form.el-form--label-top{
            /** */
            width: 50%;
            margin: auto;
            .el-form-item__content{margin-top: 0px !important;}
            .el-select{width:100%;}
            /deep/ .el-form-item__content{
                text-align: center;
            }
        }
    }
</style>