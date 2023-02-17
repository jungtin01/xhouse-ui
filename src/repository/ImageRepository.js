import Repository from '@/repository/Repository'

const resource = '/image'

export default {
    createAnImage(houseId, payload) {
        return Repository.post(`${resource}/${houseId}`, payload)
    },
    removeImage(imageId) {
        return Repository.delete(`${resource}/${imageId}`)
    },
    updateImage(imageId, payload) {
        return Repository.put(`${resource}/${imageId}`, payload)
    }
}