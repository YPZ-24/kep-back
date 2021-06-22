import MongoLib from '../lib/mongo'

class SubjectsService {
    constructor(){
        this.mongoDb = new MongoLib()
        this.collection = 'subjects'
    }

    async getSubjects({query}){
        const subjects = await this.mongoDb.getAll(this.collection, query)
        return subjects
    }

    async getSubject({query}){
        const subject = await this.mongoDb.get(this.collection, query)
        return subject
    }

    async createSubject({subject}){
        const createdSubjectId = await this.mongoDb.create(this.collection, subject)
        return createdSubjectId
    }

    async updateSubject({idSubject, subject}){
        const updatedSubjectId = await this.mongoDb.update(this.collection, idSubject, subject)
        return updatedSubjectId
    }

    async deleteSubject({idSubject}){
        const deletedSubjectId = await this.mongoDb.delete(this.collection, idSubject)
        return deletedSubjectId
    }
    
}

export default SubjectsService;