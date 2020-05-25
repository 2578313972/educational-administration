import axios from 'axios'
import router from '../router'
import Base64 from '@/plug-in/Base64.js'
import Cookie from '@/plug-in/Cookie.js'

function Http(baseurl) {
    let http = axios.create({
        baseURL: ''
    })
    // let http = ''

    this.get = (url, queryObj) => {
        /**如果没有传对象 则赋值一个空对象*/
        return http.get(url, {
            params: {
                ...(queryObj || {})
            }
        })
    }

    this.post = (url, data, queryObj) => {
        /**如果没有传对象 则赋值一个空对象*/
        return http.post(url, data || {}, {
            params: {
                ...(queryObj || {})
            }
        })
    }

    this.all = (...data) => {
        /**合并请求*/
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
                    if (!Cookie.getCookie("userInfo")) return router.replace({ path: "/login" })
                    try {
                        /** 解密报错时 直接去登录页面 */
                        let userInof = JSON.parse(Base64.decode(Cookie.getCookie("userInfo")))
                        let res = await axios.get('http://192.168.1.188:12/api/OAuth/authenticate', {
                            params: {
                                userMobile: userInof.userMobile,
                                userPassword: userInof.userPassword
                            }
                        })
                        /** 重新获取token */
                        console.log(res);
                        if (res.data.token_type === "Bearer") {
                            Cookie.setCookie('token', Base64.encode(res.data.token_type + " " + res.data.access_token))
                            return http(error.config)
                        } else {
                            throw new Error()
                        }

                    } catch (err) {
                        Cookie.removeCookie("userInfo")
                        return router.replace({ path: "/login" })
                    }
            }
        }
        return Promise.reject(error)
    })
}

export default new Http()