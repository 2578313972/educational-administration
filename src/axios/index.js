import axios from 'axios'
import router from '../router'
import Base64 from '@/plug-in/Base64.js'
import Cookie from '@/plug-in/Cookie.js'

function Http(aaa) {
    let http = axios.create({
        baseURL: aaa || 'http://192.168.1.188:12'
    })

    this.get = (url, queryObj) => {
        /**
         * 如果没有传对象 则赋值一个空对象
         */
        return http.get(url, {
            params: {
                ...(queryObj || {})
            }
        })
    }

    this.post = (url, data, queryObj) => {
        /**
         * 如果没有传对象 则赋值一个空对象
         */
        return http.post(url, data || {}, {
            params: {
                ...(queryObj || {})
            }
        })
    }

    this.all = (...data) => {
        /**
         * 合并请求
         */
        return axios.all(data).then(axios.spread((...res) => {
            return res.map((item) => item.data)
        }))
    }

    http.interceptors.request.use(config => {
        if (Cookie.getCookie("token")) {
            try {
                config.headers.Authorization = Base64.decode(Cookie.getCookie("token"));
            } catch (err) {
                console.log(err)
            }
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    http.interceptors.response.use(response => {
        return response
    }, async error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    if (!Cookie.getCookie("userInfo")) return router.replace({path:"/login"})
                    try {
                        /**
                         * 解密报错时 直接去登录页面
                         */
                        await login()
                        return http(error.config)
                    } catch (err) {
                        Cookie.removeCookie("userInfo")
                        return router.replace({path:"/login"})
                    }
            }
        }
        return Promise.reject(error)
    });

    async function login() {
        let userInof = JSON.parse(Base64.decode(Cookie.getCookie("userInfo")))
        let res = await axios.get('http://192.168.1.188:12/api/OAuth/authenticate', {
            params: {
                userMobile: userInof.userMobile,
                userPassword: userInof.userPassword
            }
        })
        /**
         * 重新获取token
         */
        if(res.status === 200){
            Cookie.setCookie('token', Base64.encode(res.data.token_type + " " + res.data.access_token), { maxAge: 60 * 20, domain: "localhost", path: "/" })
        }else{
            throw new Error()
        }
    }
}

export default new Http()