<template>
    <div id="SelectTeacher">
        <el-select v-model="value.userId" placeholder="请选择">
            <el-option v-for="item in allTeacher" :key="item.userTypeId" :label="item.userName" :value="item.userId"></el-option>
        </el-select>
    </div>
</template>

<script>
import Api from '@/http/FClass'
export default {
    data() {
        return {
            allTeacher:[]
        }
    },
    props:{
        value:{
            userName:String,
            userId:String,
        }
    },
    created() {
        Api.GetTeachers().then(res=>{
            this.allTeacher = res.data
        })
    },
    watch: {
        'value':{
            handler:function(newVal,oldVal){
                console.log(newVal);

                if(!this.value.userId)return
                this.value.userName = this.allTeacher.find(item=>item.userId===this.value.userId).userName
                this.$emit("input",this.value)
            },
            deep:true
        }
    },
}
</script>

<style lang="less" scoped>
    #SelectTeacher{
        box-sizing: border-box;
        .el-select{width:100%;}
    }
</style>