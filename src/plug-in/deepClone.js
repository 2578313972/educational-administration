// export default class {
//     constructor(obj,cloneObj) {
//         this.cloneObj = cloneObj
//         this.obj = obj
//         this.deep(this.obj,this.cloneObj)
//         return this.cloneObj
//     }
//     deep(obj,target) {
//         let newObj = target || []
//         for (var i in obj) {
//             if(typeof obj[i] === 'object'){
//                 newObj[i] = obj[i].constructor===Array?[]:{}
//                 this.deep(obj[i],newObj[i],)
//             }else{
//                 newObj[i] = obj[i]
//             }
//         }
//         return this.cloneObj = newObj
//     }
// }

function Clone (obj, target) {
  target = target || []
  for (var i in obj) {
    if (typeof obj[i] === 'object') {
      target[i] = obj[i].constructor === Array ? [] : {}
      Clone(obj[i], target[i])
    } else {
      target[i] = obj[i]
    }
  }
  return target
}
export default Clone
