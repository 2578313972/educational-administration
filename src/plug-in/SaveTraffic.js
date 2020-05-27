/**
 * 使用方法
 * save('时间（毫秒||默认1000）').then(()=>{}).catch(()=>{})
 */
let startTime = 0
function save (loneTime = 1000) {
  const newTime = new Date().getTime()
  return new Promise((res, rej) => {
    if (newTime - startTime > loneTime) {
      startTime = newTime
      res()
    } else {
      rej()
    }
  })
}

export default save
