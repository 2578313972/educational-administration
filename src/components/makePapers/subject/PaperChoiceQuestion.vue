<template>
  <div id="PaperChoiceQuestion">
    <el-form label-width="80px" ref="paperForm" :model="paperForm">
      <el-form-item
        prop="textarea"
        label="题干"
        :rules="{ required: true, message: '请输入邮箱地址', trigger: 'blur' }"
      >
        <el-input type="textarea" autosize placeholder="请输入内容" v-model="paperForm.textarea"></el-input>
      </el-form-item>

      <el-form-item
        class="enum"
        v-for="(item, index) in paperForm.data"
        :key="item.serial"
        :prop="'data.' + index + '.value'"
        :rules="{required: true, message: '域名不能为空', trigger: 'blur'}"
      >
        <el-checkbox slot="label" v-model="item.tar">{{item.serial}}、</el-checkbox>
        <el-input class="paperbtn" v-model="item.value"></el-input>
        <span class="el-icon-delete" v-show="paperForm.data.length>2" @click="deleteSer(index)"></span>
      </el-form-item>

      <el-form-item label="分值">
        <el-input-number size="small" v-model="paperForm.num"></el-input-number>
      </el-form-item>

      <el-form-item class="btn">
        <el-button round @click="resetForm">重置</el-button>
        <el-button type="info" @click="addValue" round>新增选项</el-button>
        <el-button type="primary" @click="submitTitle" round>
          <span class="el-icon-document-checked"></span>保存题目
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Api from '@/http/BMakePaper'
export default {
  data() {
    return {
      USA: ["A", "B", "C", "D", "E", "F", "G"],
      paperForm: {
        data: [
          {serial: "A",tar: false,value: ""},
          {serial: "B",tar: false,value: ""}
        ],
        textarea: "",
        num: 2
      }
    };
  },
  methods: {
    addValue() {
      let serial = this.USA[this.paperForm.data.length];
      if (!serial)
        return this.$message({ type: "info", message: "已达最大上限" });
      this.paperForm.data.push({ serial,tar:false,value: "" });
    },
    deleteSer(index) {
      this.paperForm.data.splice(index, 1);
      for (let i = index; i < this.paperForm.data.length; i++) {
        this.paperForm.data[i].serial = this.USA[i];
      }
    },
    submitTitle() {
      this.$refs["paperForm"].validate(valid => {
        if (valid) {
            let bool = true
            for (const i in this.paperForm.data) {
                if (this.paperForm.data[i].tar===true){
                    bool = false
                    break
                }
            }
            if(bool) return this.$message({message: '没有选择答案,请选择',type: 'warning'});
            let chooseQuestion = []
            for (const item of this.paperForm.data) {
                chooseQuestion.push({"cqOption": item.value,"cqIsRight": item.tar})
            }
            console.log(sessionStorage.getItem('testPaperId'));
            console.log(this.paperForm.num);
            console.log(this.paperForm.textarea);
            console.log(chooseQuestion);
            console.log({
                    tpqPaperId: +sessionStorage.getItem('testPaperId'),//试卷主键编号
                    tpqScore: this.paperForm.num,//分值
                    tpqQuestion: {
                        questionTitle: this.paperForm.textarea, //题目的标题
                        questionTypeId: 1,//题目的类型 1=选择题 2=填空题 3=问答题
                        chooseQuestion
                    }
            });

            Api.AddQuestionToTestPaper({
                    tpqPaperId: sessionStorage.getItem('testPaperId'),//试卷主键编号
                    tpqScore: this.paperForm.num,//分值
                    tpqQuestion: {
                        questionTitle: this.paperForm.textarea, //题目的标题
                        questionTypeId: 1,//题目的类型 1=选择题 2=填空题 3=问答题
                        chooseQuestion
                    }
            }).then(res=>{
                console.log(res);
                this.$message({message: res.data.message,type: 'warning'})
            })
        } else {
            return false;
        }
      });
    },
    resetForm() {
      this.$refs["paperForm"].resetFields();
    },
  }
};
</script>

<style lang="less" scoped>
#PaperChoiceQuestion {
  .btn {
    margin-top: 15px;
  }
  .el-input {
    width: calc(100% - 60px);
    margin-right: 12.5px;
  }
  .el-form-item__content .el-button.is-round {
    padding: 7px 15px;
  }
  .enum span {
    width: 35px;
    line-height: 35px;
    border-radius: 50%;
    background: #f36b72;
    color: white;
    text-align: center;
    cursor: pointer;
    font-size: 18px;
  }
}
</style>