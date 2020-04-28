import axios from '@/axios'
export default{
    GetUserRoles : params => axios.get("/api/UserType/GetUserRoles",params), // 获取所有角色
    GetTeachers : params => axios.get("/api/User/GetTeachers",params), // 获取所有的老师信息
    ModifyTeacher : data => axios.post("/api/User/ModifyTeacher",data), // 修改老师信息
    AddTeacher : data => axios.post("/api/User/AddTeacher",data), // 添加老师
    RemoveTeacher : data => axios.post(`/api/User/RemoveTeacher?uid=${data}`) // 移除老师
}
