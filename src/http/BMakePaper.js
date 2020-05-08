import axios from '@/axios'
export default {
    GetQuestionType: () => axios.get(`/api/TestPaper/GetQuestionType`),// 获取问题的类型
    MakeTestPaper: data => axios.post(`/api/TestPaper/MakeTestPaper?uid=${data.uid}`, data.paper),// 制作试卷
    AddQuestionToTestPaper: data => axios.post(`/api/TestPaper/AddQuestionToTestPaper`, data), // 添加题目到试卷
    GetTestPaper: parmas => axios.get(`/api/TestPaper/GetTestPaper`, parmas), // 获取试卷信息
    ModifyScore: data => axios.post(`/api/TestPaper/ModifyScore`, data), // 修改分值
    RemoveQuestionFromTestPaper: data => axios.post(`/api/TestPaper/RemoveQuestionFromTestPaper`,{}, data), // 从试卷上删除题目
    ModifyQuestion: data => axios.post(`/api/TestPaper/ModifyQuestion`, data), // 修改题目
}