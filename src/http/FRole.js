import axios from '@/axios'
export default{
    GetUserRoles : () => axios.get('/api/UserType/GetUserRoles'), // 获取所有角色
    AddUserRole : data => axios.post(`/api/UserType/AddUserRole?userRoleName=${data}`), // 添加角色
    RemoveUserRole : data => axios.post(`/api/UserType/RemoveUserRole?userRoleId=${data}`), // 删除角色
    ModifyUserRole : data => axios.post(`/api/UserType/ModifyUserRole?id=${data.id}&userRoleName=${data.userRoleName}`), // 修改角色名称
    OrderUserRoleNo : data => axios.post(`/api/UserType/OrderUserRoleNo`,data) // 角色列表重新排序
}