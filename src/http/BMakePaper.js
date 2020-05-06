import axios from '@/axios'
export default {
    GetQuestionType: () => axios.get(`/api/TestPaper/GetQuestionType`),// 获取问题的类型
    MakeTestPaper: data => axios.post(`/api/TestPaper/MakeTestPaper?uid=${data.uid}`, data.paper),// 制作试卷
    AddQuestionToTestPaper: data => axios.post(`/api/TestPaper/AddQuestionToTestPaper`, data), // 添加题目到试卷
}