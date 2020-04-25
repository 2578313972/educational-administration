import axios from '@/axios'

function Login() {
    this.authenticate = params => axios.get("/api/OAuth/authenticate",params)
}
export default new Login()