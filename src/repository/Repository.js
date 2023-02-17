import axios from 'axios'

const baseDomain = 'http://localhost:1337'
// const baseDomain = 'http://spacenet.vn:1357'
// const baseDomain = 'http://113.161.84.125:1359'
const baseURL = `${baseDomain}/api`

const instance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ localStorage.getItem('token') == null ? '' : localStorage.getItem('token').trim() }`
    }
})

export default instance

export const setAuthorizationHeader = (axiosInstance, token) => {
    axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`
    axios.defaults.headers['Authorization'] = `Bearer ${token}`
}