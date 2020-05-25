import axios from '@/axios'
export default{
    All : () => axios.all(axios.get("api/Class/GetAllClass"),axios.get("/api/User/GetTeachers"),axios.get("/api/Class/GetAllCourse")),
    /*合并请求 (用户身份验证,获取所有的班级的信息,获取所有的老师的信息)*/


    GetAllClass : () => axios.get("/api/Class/GetAllClass"),
    /*获取所有的班级的信息*/

    GetTeachers : () => axios.get("/api/User/GetTeachers"),
    /*获取所有的老师的信息*/

    GetAllCourse : () => axios.get("/api/Class/GetAllCourse"),
    /*获取所有的专业的信息*/

    AddClass : data => axios.post("/api/Class/AddClass",data),
    /*添加班级 */

    RemoveClass : params => axios.get("/api/Class/RemoveClass",params),
    /*删除班级 */

    ModifyClass : data => axios.post("/api/Class/ModifyClass",data)
    /*修改班级信息，包括班级名称、授课老师、课程*/
}