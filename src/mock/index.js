// mock.js
// 引入mockjs
const Mock = require('mockjs')
Mock.mock('/mock/FClass', () => {
  const newsList = []
  for (let i = 0; i < 5; i++) {
    const newNewsObject = {
      id: Mock.Random.increment(),
      calssName: 'web' + Mock.Random.natural(1, 18) + '班', // Random.ctitle( min, max ) 随机产生一个中文标题，长度默认在3-7之间
      classTeacher: Mock.Random.cname(),
      major: 'js',
      classNumber: Mock.Random.natural(0, 1),
      date: Mock.Random.date()
    }
    newsList.push(newNewsObject)
  }
  return newsList
})

const projectList = []
Mock.mock('/mock/addFClass', ops => { // 拦截ajax请求，调用函数
  console.log(ops) // 先看一下这个ops是什么
  projectList.push(ops)
  return projectList
})
