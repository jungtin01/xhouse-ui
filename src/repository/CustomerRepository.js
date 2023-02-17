import Repository from '@/repository/Repository'

const resource = '/customer'

export default {
    editInfo(payload, contractId) {
        return Repository.put(`${resource}/${contractId}`, payload)
    }
}