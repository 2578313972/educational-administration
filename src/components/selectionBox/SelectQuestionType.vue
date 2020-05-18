<!--
    使用方法：
        obj={
            typeId:"",
            typeName:"",
            type:"click | select"
        }
        <select-question-type v-model="obj" />
-->
<template>
    <div id="SelectQuestionType">
        <div v-if="allData.type==='click'">
            <el-radio-group v-model="allData.typeId">
                <el-radio v-for="item in allUser" :key="item.typeId" :label="item.typeId">{{item.typeName}}</el-radio>
            </el-radio-group>
        </div>
        <div v-if="allData.type==='select'">
            <el-select v-model="allData.typeId" placeholder="请选择">
                <el-option label="请选择角色" value="0"></el-option>
                <el-option v-for="item in allUser" :key="item.typeId" :label="item.userTypeTypeName" :value="item.typeId"></el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
import Api from '@/http/BMakePaper'
export default {
    data() {
        return {
            allData:{},
            allUser:[]
        }
    },
    props:{
        value:{
            type:Object,
            required: true
        }
    },
    created() {
        Api.GetQuestionType().then(res=>{
            this.allUser = res.data
            this.$nextTick(()=>{
                this.allData = this.value
                this.allData.typeId = Number(this.value.typeId)
                if(!this.allData.type) this.allData.type = 'select'
            })
        })
    },
    watch: {
        'allData.typeId'(newVal){
            // console.log(newVal);
            // try{
            //     newVal.typeName = this.allUser.find(item=>item.userTypeId===newVal.typeId).userTypeTypeName
            // }catch{}
            // this.$emit("input",newVal)
        }
    },
}
</script>

<style lang="less" scoped>
    // #SelectQuestionType{
        // margin: auto 10px;
        // box-sizing: border-box;
        // .el-select{width:100%;}
    // }
</style>