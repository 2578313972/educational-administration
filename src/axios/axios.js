import axios from './api.js'
// /api/OAuth/authenticate

export const enter = params => {
    return axios.get("/api/OAuth/authenticate",{
        params
    })
}
