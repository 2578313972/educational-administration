import axios from '@/axios'

function FPassword() {
    this.ModifyPassword = params => axios.get("/api/User/ModifyPassword",params) // 修改密码
}
export default new FPassword()