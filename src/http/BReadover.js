import axios from '@/axios'
export default {
    GetTestTask: parmas => axios.get(`/api/TestPaper/GetTestTask`,parmas),// 分页获取测试任务表
    GetStudentTest: parmas => axios.get(`/api/TestResult/GetStudentTest`,parmas),// 获取学生考试的基本信息
}