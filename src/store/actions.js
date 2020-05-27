export default {
  modifyData (context, data) {
    context.commit('modifyData', data)
  },
  modifyToken (context, data) {
    context.commit('modifyToken', data)
  }
}
