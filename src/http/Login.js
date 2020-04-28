import axios from '@/axios'
export default{
    authenticate : (params) => axios.get("/api/OAuth/authenticate",params) // 登录
}