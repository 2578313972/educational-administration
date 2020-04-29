<template>
    <div id="PaperMessage">
        <el-form label-position="top" :rules="fromPaperRules" label-width="150px" :model="fromPaperName">
            <el-form-item label="试卷名称" prop="name">
                <el-input  placeholder="请输入试卷名称"  v-model="fromPaperName.name"></el-input>
            </el-form-item>
            <el-form-item label="课程名称" prop="selectCourse">
                <el-select v-model="fromPaperName.selectCourse" placeholder="请选择课程">
                    <el-option label="区域一" value="shanghai"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="next" >下一步</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        var checkAge = (rule, value, callback) => {
            if (!value) return callback(new Error('试卷名称不能为空'));
            if(!(/^\w+$/.test(value))){
                callback(new Error('请输入规范的试卷名称'));
            } else{
                callback();
            }
        };
        return {
            fromPaperName:{
                /** */
                name:"",
                selectCourse:""
            },
            fromPaperRules:{
                name: [{ validator:checkAge, trigger: 'change' }],
                selectCourse: [{ required: true, message: '课程不能为空'}]

            },
        }
    },
    methods: {
        next(){
            this.$emit('next')
        }
    },
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
            .el-form-item__content{
                margin-top: 15px;
                text-align: center;
            }
        }
    }
</style>