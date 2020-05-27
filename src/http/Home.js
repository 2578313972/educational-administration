import axios from '@/axios'
export default {
  UploadHeader: data => axios.post(`/api/User/UploadHeader?userUid=${data.userUid}`, data.fm)// 上传头像
}
