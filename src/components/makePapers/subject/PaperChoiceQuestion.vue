<template>
    <div id="PaperChoiceQuestion">
        <el-form label-width="80px" >
            <el-form-item label="题干">
                <el-input type="textarea" rows="1" placeholder="请输入内容" v-model="textarea"></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
                <el-input></el-input>
            </el-form-item>
            <el-form-item label="活动形式">
                <el-input></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-button round>重置</el-button>
                <el-button type="info" round>新增选项</el-button>
                <el-button type="primary" round><span class="el-icon-document-checked"></span>保存题目</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            textarea:'',
        }
    },
}
</script>

<style lang="less" scoped>

</style>