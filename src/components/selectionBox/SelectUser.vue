<template>
    <div id="SelectUser">
        <el-radio-group v-model="radio">
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
            radio:"",
            allUser:[]
        }
    },
    props:{
        value:String
    },
    created() {
        Api.GetUserRoles().then(res=>{
            this.allUser = res.data
            this.radio = this.value
            console.log(this.allUser);

        })
    },
    watch: {
        radio(newVal){
            // console.log(newVal)
            // let a = this.allUser.find(item=>item.userTypeTypeName===newVal)
            this.$emit("input",newVal)
        }
    },
}
</script>

<style lang="less" scoped>
    #SelectUser{margin: auto 10px;}
</style>