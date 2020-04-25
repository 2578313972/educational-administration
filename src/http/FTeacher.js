import axios from '@/axios'

function FTeacher() {
    this.GetUserRoles = params => axios.get("/api/UserType/GetUserRoles",params) // 获取所有角色
    this.GetTeachers = params => axios.get("/api/User/GetTeachers",params) // 获取所有的老师信息
    this.ModifyTeacher = data => axios.post("/api/User/ModifyTeacher",data) // 修改老师信息
    this.AddTeacher = data => axios.post("/api/User/AddTeacher",data) // 添加老师
    this.RemoveTeacher = data => axios.post(`/api/User/RemoveTeacher?uid=${data}`) // 移除老师
}
export default new FTeacher()
