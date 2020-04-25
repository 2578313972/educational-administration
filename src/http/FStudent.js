import axios from '@/axios'

function FStudent(){
    this.GetAllClass = () => axios.get('/api/Class/GetAllClass') // 获取所有的班级信息
    this.GetClassStudent = params => axios.get('/api/Student/GetClassStudent',params) // 获取班级所有信息
    this.AddClass = data => axios.post("/api/Class/AddClass",data) // 添加班级
    this.AddStudent = data => axios.post("/api/Student/AddStudent",data) // 添加学生
    this.ModifyStudent = data => axios.post("/api/Student/ModifyStudent",data) // 修改学生信息，包括学生名称、班级编号、生日、手机号、密码、性别
    this.RemoveStudent = params => axios.get("/api/Student/RemoveStudent",params) // 删除学生
}
export default new FStudent()