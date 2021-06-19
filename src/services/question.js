import MongoLib from '../lib/mongo'

class QuestionsService {
    constructor(){
        this.mongoDb = new MongoLib()
        this.collection = 'questions'
    }

    async getQuestions({query}){
        const questions = await this.mongoDb.getAll(this.collection, query)
        return questions
    }

    async getQuestion({query}){
        const question = await this.mongoDb.get(this.collection, query)
        return question
    }

    async createQuestion({question}){
        const createdQuestionId = await this.mongoDb.create(this.collection, question)
        return createdQuestionId
    }

    async updateQuestion({idQuestion, question}){
        const updatedQuestionId = await this.mongoDb.update(this.collection, idQuestion, question)
        return updatedQuestionId
    }

    async deleteQuestion({idQuestion}){
        const deletedQuestionId = await this.mongoDb.delete(this.collection, idQuestion)
        return deletedQuestionId
    }
}

export default QuestionsService;