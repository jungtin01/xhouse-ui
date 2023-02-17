import Repository from '@/repository/Repository'

const resource = '/contract'
const status = '/contract-status'

export default {
    getContractsByHouse(page, size, status, houseId) {
        return Repository.get(`${resource}/${houseId}?page=${page}&size=${size}&status=${status}`)
    },
    createContract(payload, houseId) {
        return Repository.post(`${resource}/${houseId}`, payload)
    },
    updateContract(payload, contractId, houseId) {
        return Repository.put(`${resource}/${houseId}/${contractId}`, payload)   
    },
    closeContract(contractId) {
        return Repository.put(`${status}/${contractId}`)   
    },
    openContract(contractId, houseId) {
        return Repository.put(`${status}/${houseId}/${contractId}`)   
    },
    removeContract(contractId) {
        return Repository.delete(`${resource}/${contractId}`)
    }
}