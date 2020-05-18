import axios from '@/axios'
export default {
    GetAllTestPaper: () => axios.get(`/api/TestPaper/GetAllTestPaper`),// 获取所有的试卷
    GetTestPaper: parmas => axios.get(`/api/TestPaper/GetTestPaper`,parmas),// 获取试卷信息
    GetTestPaperList: parmas => axios.get(`/api/TestPaper/GetTestPaperList`,parmas),// 分页获取试卷列表
    RemoveTestPaper: data => axios.post(`/api/TestPaper/RemoveTestPaper`,{},data),// 删除试卷
    ModifyTestPaper: data => axios.post(`/api/TestPaper/ModifyTestPaper`,data),// 修改试卷内容
/**
 * {
tpId:0,//试卷编号
tpCourseId:0,//课程编号，可修改
tpTitle:"",//试卷标题，可修改
}
 */
}