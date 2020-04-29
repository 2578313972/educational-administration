<template>
    <div id="ClickUser">
        <el-radio-group v-model="radio.radioName">
            <el-radio label="全部">全部</el-radio>
            <el-radio v-for="item in allUser" :key="item.userTypeId" :label="item.userTypeTypeName">{{item.userTypeTypeName}}</el-radio>
        </el-radio-group>
    </div>
</template>

<script>
import Api from '@/http/FTeacher'
export default {
    data() {
        return {
            radio:{},
            allUser:[]
        }
    },
    props:{
        value:{
            radioName:String,
            radioId:String
        }
    },
    created() {
        Api.GetUserRoles().then(res=>{
            this.allUser = res.data
            this.radio = this.value
        })
    },
    watch: {
        radio:{
            handler(newVal){
                try{
                    newVal.radioId = this.allUser.find(item=>item.userTypeTypeName===newVal.radioName).userTypeId
                }catch{}
                this.$emit("input",newVal)
            },
            deep:true
        }
    },
}
</script>

<style lang="less" scoped>
    #ClickUser{margin: auto 10px;}
</style>