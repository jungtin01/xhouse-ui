import Repository from '@/repository/Repository'

const auth = '/authorization'
const users = '/users'
const shopUsers = 'shop-users'
const resource = '/user'
const profile = '/my-profile'

export default {
    signIn(payload) {
        return Repository.post(`${auth}`, payload)
    },
    getUsers(page, size) {
        return Repository.get(`${users}?page=${page}&size=${size}`)
    },
    getShopUsers(page, size) {
        return Repository.get(`${shopUsers}?page=${page}&size=${size}`)
    },
    createUser(user) {
        return Repository.post(`${resource}`, user)
    },
    removeUser(userId) {
        return Repository.delete(`${resource}/${userId}`)
    },
    editUser(userId, payload) {
        return Repository.put(`${resource}/${userId}`, payload)
    },
    getProfile() {
        return Repository.get(`${profile}`)
    },
    editProfile(payload) {
        return Repository.put(`${profile}`, payload)
    },
    changePassword(payload) {
        return Repository.post(`${resource}/change_password`, payload)
    }
}