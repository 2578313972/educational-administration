import axios from '@/axios'
export default {
    GetTestTask: parmas => axios.get(`/api/TestPaper/GetTestTask`,parmas),// 分页获取测试任务表
    GetStudentTest: parmas => axios.get(`/api/TestResult/GetStudentTest`,parmas),// 获取学生考试的基本信息
    GetStudentTestPaper: parmas => axios.get(`/api/TestResult/GetStudentTestPaper`,parmas),// 获取学生试卷的详情信息
    SetTestPaperScore: (data,parmas) => axios.post(`/api/TestResult/SetTestPaperScore`,data,parmas),// 给试卷打分
}