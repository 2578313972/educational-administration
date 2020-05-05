<template>
    <div id="PaperBlanksTest">
        <el-form label-width="80px" ref="paperForm" :model="paperForm">
            <el-form-item label="题干" >
                <el-button round  @click="addValue" >插入填空</el-button>
            </el-form-item>
            <el-form-item>
                <el-input type="textarea" autosize placeholder="请输入内容" v-model="paperForm.textarea"></el-input>
            </el-form-item>
            <el-form-item
                class="enum"
                v-for="(item, index) in paperForm.data"
                :key="item.serial"
                :prop="'data.' + index + '.value'"
                :rules="{required: true, message: '域名不能为空', trigger: 'blur'}"
            >
                <span slot="label">{{index+1}}</span>
                <el-input class="paperbtn" :placeholder="'请输入第'+(index+1)+'个空的答案'" v-model="item.value"></el-input>
                <el-input-number size="small" :min="1" v-model="item.num"></el-input-number>
            </el-form-item>
            <el-form-item  style="outline: none;" label="题目预览" >
                <el-input class="paperbtn" readonly v-model="listVal" ></el-input>
            </el-form-item>
            <el-form-item class="btn">
                <el-button round @click="resetForm">重置</el-button>
                <el-button type="primary" round>新增选项</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            num:0,
            paperForm: {
                textarea: "",
                data: [],
            },
            listVal:""
        }
    },
    methods: {
        addValue(){
            this.paperForm.textarea = this.paperForm.textarea+"_"
            this.paperForm.data.push({num: 2,value: ""})
        },
        resetForm() {
            this.$refs["paperForm"].resetFields();
            this.paperForm.textarea = ''
        },
    },
    watch: {
        'paperForm.textarea'(newVal,oldVal){
            // if(newVal.length>oldVal.length){
            //     let newData = newVal.slice(oldVal.length)
            //     for(var i=0;i<newData.length;i++){
            //         var res=newData.indexOf('_',i);
            //         if(res === -1)break;
            //         i=res;
            //         console.log(res+oldVal.length)
            //         this.paperForm.data.push({num: 2,value: ""})
            //     }
            // }else{
            //     alert()
            //     // let newData = newVal.slice(oldVal.length)
            //     // for(var i=0;i<newData.length;i++){
            //     //     var res=newData.indexOf('_',i);
            //     //     if(res === -1)break;
            //     //     i=res;
            //     //     console.log(res+oldVal.length)
            //     //     this.paperForm.data.push({num: 2,value: ""})
            //     // }
            // }


        let arr = []
        for(var i=0;i<newVal.length;i++){
            var res=newVal.indexOf('_',i);
            if(res === -1)break;
            i=res;
            console.log(res+oldVal.length)
            arr.push({num: 2,value: ""})
        }
        this.paperForm.data = arr
        this.listVal = newVal.replace(/_/g, '_____(2分)');
        }
    },
}
</script>

<style lang="less" scoped>
  #PaperBlanksTest{
    .btn {
        margin-top: 15px;
    }
    .el-input {
        width: calc(100% - 150px);
        margin-right: 12.5px;
    }
    .el-form-item__content .el-button.is-round {
        padding: 7px 15px;
    }
    .enum span {
        width: 20px;
        line-height: 20px;
        display:inline-block;
        border-radius: 50%;
        background: #f36b72;
        color: white;
        text-align: center;
        cursor: pointer;
        font-size: 18px;
    }
  }
</style>