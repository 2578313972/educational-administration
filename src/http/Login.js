import axios from '@/axios'

function Login() {
    this.authenticate = params => axios.get("/api/OAuth/authenticate",params)
        /**
         * 用户身份验证
         */
}
export default new Login()