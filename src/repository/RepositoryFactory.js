import UserRepository from '@/repository/UserRepository'
import HouseRepository from '@/repository/HouseRepository'
import ContractRepository from '@/repository/ContractRepository'
import ImageRepository from '@/repository/ImageRepository'
import CustomerRepository from '@/repository/CustomerRepository'

const repositories = {
    user: UserRepository,
    house: HouseRepository,
    contract: ContractRepository,
    image: ImageRepository,
    customer: CustomerRepository
}

export const RepositoryFactory = {
    get: name => repositories[name]
}