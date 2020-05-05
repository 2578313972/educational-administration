<template>
    <div id="SelectUser">
        <el-select v-model="value.TypeId" placeholder="请选择">
            <el-option label="请选择角色" value="0"></el-option>
            <el-option v-for="item in allUser" :key="item.userTypeId" :label="item.userTypeTypeName" :value="item.userTypeId"></el-option>
        </el-select>
    </div>
</template>

<script>
import Api from '@/http/FTeacher'
export default {
    data() {
        return {
            allUser:[]
        }
    },
    props:{
        value:{
            TypeName:String,
            TypeId:String
        }
    },
    created() {
        Api.GetUserRoles().then(res=>{
            this.allUser = res.data
        })
    },
    watch: {
        value:{
            handler:function(newVal,oldVal){
                try{
                    newVal.TypeName = this.allUser.find(item=>item.userTypeId===newVal.TypeId).userTypeTypeName
                }catch{}
                this.$emit("input",newVal)
            },
            deep:true
        }
    },
}
</script>

<style lang="less" scoped>
    #SelectUser{
        margin: auto 10px;
        box-sizing: border-box;
        .el-select{width:100%;}
    }
</style>