import MongoLib from '../lib/mongo'

class UsersService {
    constructor(){
        this.mongoDb = new MongoLib()
        this.collection = 'users'
    }

    async getUser({query}){
        const user = await this.mongoDb.get(this.collection, query)
        return user
    }

    async getUsers({query}){
        const users = await this.mongoDb.getAll(this.collection, query)
        return users
    }

    async createUser({user}){
        const createdUserId = await this.mongoDb.create(this.collection, user)
        return createdUserId
    }

    async updateUser({idUser, user}){
        const updatedUserId = await this.mongoDb.update(this.collection, idUser, user)
        return updatedUserId
    }
}

export default UsersService;