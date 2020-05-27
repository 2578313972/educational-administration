import axios from '@/axios'
export default {
  GetTestTask: parmas => axios.get('/api/TestPaper/GetTestTask', parmas), // 分页获取测试任务表
  SetTest: data => axios.post(`/api/TestPaper/SetTest?uid=${data.uid}`, data.data), // 安排测试任务
  RemoveTestTask: data => axios.post('/api/TestPaper/RemoveTestTask', {}, data), // 删除测试任务
  ModifyTestTask: data => axios.post('/api/TestPaper/ModifyTestTask', data)// 修改测试任务,修改试卷，班级，测试时间
}
