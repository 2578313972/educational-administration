import axios from '@/axios'
export default{
    ModifyPassword : params => axios.get("/api/User/ModifyPassword",params) // 修改密码
}