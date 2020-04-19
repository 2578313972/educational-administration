<template>
    <div id="FClass">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>基础数据</el-breadcrumb-item>
            <el-breadcrumb-item>班级管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-container>
            <el-header style="height: 50px;">
                <span @click="ruleForm.className = '',ruleForm.major = '',ruleForm.teacher = '',selectWin=true,centerDialogVisible=true"><i class="el-icon-circle-plus-outline"></i>新增班级</span>
            </el-header>
            <el-main>
                <el-table :data="tableData" style="width: 100%" >
                    <el-table-column label="#"  min-width="40px" >
                        <template slot-scope="scope">
                            <span>{{ scope.row.id }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="班级名称" min-width="100px" >
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.calssName }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="授课老师" min-width="80px" >
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.classTeacher }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="专业" min-width="50px" >
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.major }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="班级人数" min-width="80px" >
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.classNumber }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="开班日期" min-width="100px">
                        <template slot-scope="scope">
                            <span>{{ scope.row.date}}</span>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="操作"  min-width="150px">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
        </el-container>

        <el-dialog title="新增班级信息" :visible.sync="centerDialogVisible" width="35%" center>

            <!-- --------------------------------------------------------------------------------------- -->
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="班级名称">
                    <el-input v-model="ruleForm.className"></el-input>
                </el-form-item>
                <el-form-item label="专业课程">
                    <el-select v-model="ruleForm.major" placeholder="请选择">
                    <el-option label="Java" value="Java"></el-option>
                    <el-option label="Typescript" value="Typescript"></el-option>
                    <el-option label="javascript" value="javascript"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="授课老师">
                    <el-select v-model="ruleForm.teacher" placeholder="请选择">
                    <el-option label="陈哥" value="陈哥"></el-option>
                    <el-option label="富康" value="富康"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <!-- --------------------------------------------------------------------------------------- -->

            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="selectWin?addData():modification()" >{{selectWin?'添 加':'修 改'}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [],
            selectWin:true,
            centerDialogVisible:false, // 控制新增弹框
            ruleForm: {
                className: '', // 
                major: '',
                teacher:''
            },
            selectIndex:0,
            selectData:{}
        }
    },
    created(){
        this.axios.get('/mock/FClass').then(res => {
            this.tableData = res.data
        })
    },
    methods: {
        handleEdit(index, row) { // 编辑
            this.selectWin = false
            this.centerDialogVisible = true
            this.ruleForm.className = row.calssName
            this.ruleForm.major = row.major
            this.ruleForm.teacher = row.classTeacher
            this.selectIndex = index
            this.selectData = row
        },
        handleDelete(index, row) { // 删除
            console.log(index,row)
            if(this.tableData[index].classNumber) return this.$message({
                message: '该班级中还有学生，不能删除该班级。',
                type: 'warning'
            });
                
            
            this.$confirm('此操作将永久删除该班级, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tableData.splice(index,1)
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        modification(){ // 修改
            this.tableData[this.selectIndex].calssName = this.ruleForm.className
            this.tableData[this.selectIndex].major = this.ruleForm.major
            this.tableData[this.selectIndex].classTeacher = this.ruleForm.teacher
            this.centerDialogVisible = false
        },
        addData(){ // 添加数据
            this.axios.get('/mock/addFClass').then(res => { // url即在mock.js中定义的
                console.log(res) // 打印一下响应数据
            })
            if(this.ruleForm.className&&this.ruleForm.major&&this.ruleForm.teacher){
                    this.tableData.unshift({
                        id:0,
                        calssName:this.ruleForm.className,
                        classTeacher:this.ruleForm.teacher,
                        major:this.ruleForm.major,
                        classNumber:0,
                        date:new Date().toLocaleDateString()
                    }
                )
                this.centerDialogVisible = false
            }else{
                this.$message.error('输入框不得为空');
            }
        }
    }
}
</script>

<style lang="less">
    #FClass{
        box-sizing: border-box;
        padding:10px;
        padding:10px 25px;
        .el-container.is-vertical{
            padding: 0px 20px;
            margin-top: 25px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            .el-header{
                line-height: 50px;
                color:#469FFF;
                font-size: 17px;
                font-weight: 600;
                border-bottom: 1px solid #EBEEF5;
                i{
                    margin-right: 5px;
                }
                span{
                    cursor: pointer;
                    display: inline-block;
                    height: 100%;
                }
            }
            .el-main{padding: 0;}
            .el-table--fit{
                width: 100%;
                margin-top: 15px;
                overflow: hidden;
            }
        }
        .el-select{width:100%;}
    }
</style>