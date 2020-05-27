import axios from '@/axios'
export default {
  GetTestPaperByClassId: parmas => axios.get('/api/TestResult/GetTestPaperByClassId', parmas), // 根据班级获取班级的测试信息
  GetTestResultByTaskId: parmas => axios.get('/api/TestResult/GetTestResultByTaskId', parmas)// 根据测试任务编号获取学生的成绩
}
