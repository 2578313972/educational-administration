import axios from 'axios'
import router from '../router'
import Base64 from '@/plug-in/Base64.js'
import Cookie from '@/plug-in/Cookie.js'

let http = axios.create({timeout:3000})

http.interceptors.request.use(function (config) {
    console.log(config)
    if(Cookie.getCookie("token")){
        config.headers.Authorization = Base64._utf8_decode(Cookie.getCookie("token"));
    }
    return config;
}, function (error) {
    // console.log(error)
    return Promise.reject(error);
});

http.interceptors.response.use(function (response) {
    // console.log(response)
    return response
}, function (error) {
    // console.log(error)
    if (error.response) {
        switch (error.response.status) {
            case 401:
                if(router.app._route.fullPath !== '/login') router.replace('/login')
        }
    }
    return Promise.reject(error.response.data);
});
export default http