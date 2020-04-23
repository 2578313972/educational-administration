import axios from './api.js'




export default function FClass() {
    this.authenticate = params => axios({
        /**
         * 用户身份验证
         */
        url:"/api/OAuth/authenticate",
        method:"GET",
        params
    })
    this.GetAllClass = () => axios({
        /**
         * 获取所有的班级的信息
         */
        url:"/api/Class/GetAllClass",
        method:"GET"
    })
    this.GetTeachers = () => axios({
        /**
         * 获取所有的老师的信息
         */
        url:"/api/User/GetTeachers",
        method:"GET"
    })
    this.GetAllCourse = () => axios({
        /**
         * 获取所有的专业的信息
         */
        url:"/api/Class/GetAllCourse",
        method:"GET"
    })
    this.AddClass = data => axios({
        /**
         * 添加班级
         */
        url:'/api/Class/AddClass',
        method:'POST',
        data
    })
    this.RemoveClass = params => axios({
        /**
         * 删除班级
         */
        url:'/api/Class/RemoveClass',
        method:'GET',
        params
    })
    this.ModifyClass = data => axios({
        /**
         * 修改班级信息，包括班级名称、授课老师、课程
         */
        url:'/api/Class/ModifyClass',
        method:'POST',
        data
    })


}

