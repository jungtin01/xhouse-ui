import Repository from '@/repository/Repository'

const resource = '/house'

export default {
    createHouse(payload) {
        return Repository.post(`${resource}`, payload)
    },
    getHouses(page, size) {
        return Repository.get(`${resource}?page=${page}&size=${size}`)
    },
    getHouseByName(name) {
        return Repository.get(`${resource}?name=${name}`)
    },
    getCurrentHouse(houseId) {
        return Repository.get(`${resource}/${houseId}`)
    },
    editHouse(houseId, payload) {
        return Repository.put(`${resource}/${houseId}`, payload)
    },
    removeHouse(houseId) {
        return Repository.delete(`${resource}/${houseId}`)
    }
}