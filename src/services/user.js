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

    async createUser({user}){
        const createdUserId = await this.mongoDb.create(this.collection, user)
        return createdUserId
    }
}

export default UsersService;