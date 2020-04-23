import axios from '@/axios'

function FClass() {
    this.All = () => axios.all(axios.get("/api/Class/GetAllClass"),axios.get("/api/User/GetTeachers"),axios.get("/api/Class/GetAllCourse"))
    /**
     *合并请求 (用户身份验证,获取所有的班级的信息,获取所有的老师的信息)
     */
    this.GetAllCourse = () => axios.get("/api/Class/GetAllCourse")
        /**
         * 获取所有的专业的信息
         */
    this.AddClass = data => axios.post("/api/Class/AddClass",data)
        /**
         * 添加班级
         */
    this.RemoveClass = params => axios.get("/api/Class/RemoveClass",params)
        /**
         * 删除班级
         */
    this.ModifyClass = data => axios.post("/api/Class/ModifyClass",data)
        /**
         * 修改班级信息，包括班级名称、授课老师、课程
         */
}
export default new FClass()