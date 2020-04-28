import axios from '@/axios'
export default{
    GetAllClass : () => axios.get('/api/Class/GetAllClass'), // 获取所有的班级信息
    GetClassStudent : params => axios.get('/api/Student/GetClassStudent',params), // 获取班级所有信息
    AddClass : data => axios.post("/api/Class/AddClass",data), // 添加班级
    AddStudent : data => axios.post("/api/Student/AddStudent",data), // 添加学生
    ModifyStudent : data => axios.post("/api/Student/ModifyStudent",data), // 修改学生信息，包括学生名称、班级编号、生日、手机号、密码、性别
    RemoveStudent : params => axios.get("/api/Student/RemoveStudent",params) // 删除学生
}