import axios from '@/axios'

function FStudent(){
    this.GetAllClass = () => axios.get('/api/Class/GetAllClass') // 获取所有的班级信息
    this.GetClassStudent = params => axios.get('/api/Student/GetClassStudent',params) // 获取班级所有信息
    this.AddClass = data => axios.post("/api/Class/AddClass",data) // 添加班级
    this.AddStudent = data => axios.post("/api/Student/AddStudent",data) // 添加学生
}
export default new FStudent()