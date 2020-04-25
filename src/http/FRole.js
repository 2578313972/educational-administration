import axios from '@/axios'

function FRole() {
    this.GetUserRoles = () => axios.get('/api/UserType/GetUserRoles') // 获取所有角色
    this.AddUserRole = data => axios.post(`/api/UserType/AddUserRole?userRoleName=${data}`) // 添加角色
    this.RemoveUserRole = data => axios.post(`/api/UserType/RemoveUserRole?userRoleId=${data}`) // 删除角色
    this.ModifyUserRole = data => axios.post(`/api/UserType/ModifyUserRole?id=${data.id}&userRoleName=${data.userRoleName}`) // 修改角色名称
}
export default new FRole()