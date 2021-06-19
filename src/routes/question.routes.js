import { Router } from "express"
import routeHelper from "../utils/middleware/routeHelper";
import validationHandler from '../utils/middleware/validationHandler'
import Boom from '@hapi/boom'
import {ObjectId} from 'mongodb'
import QuestionsService from "../services/question";
import { createQuestionSchema, updateQuestionSchema } from "../utils/schemas/question";
import SubjectsService from "../services/subject";

function questionsApi(app){
    const router = Router();
    app.use('/api/questions', router)
    const questionsService = new QuestionsService()
    const subjectsService = new SubjectsService()

    router.get('/', routeHelper(async(req, res)=>{
        let questions = await questionsService.getQuestions({})
        res.status(200).json({
            statusCode: 200,
            message: 'Questions listed',
            data: questions,
        })
    }))

    router.get('/:idQuestion', routeHelper(async(req, res)=>{
        const {idQuestion} = req.params
        let query = {_id: ObjectId(idQuestion)}
        const question = await questionsService.getQuestion({query})
        res.status(200).json({
            statusCode: 200,
            message: 'Question finded',
            data: question
        })
    }))
    
    router.get('/subject/:idSubject', routeHelper(async(req, res)=>{
        const {idSubject} = req.params
        //60cc41f3e7b7c93304066bad
        let query = {idSubject: ObjectId(idSubject)}
        const questions = await questionsService.getQuestions({query})
        res.status(200).json({
            statusCode: 200,
            message: 'Questions finded',
            data: questions
        })
    }))

    router.post('/', validationHandler(createQuestionSchema), routeHelper(async(req, res)=>{
        const question = req.body
        //Que la pregunta aún no exista
        let query = {question: question.question}
        const questionFinded = await questionsService.getQuestion({query})
        if(questionFinded) throw Boom.badRequest('Question already exists');
        //Que la materia exista
        query = {_id: ObjectId(question.idSubject)}
        const subjectFinded = await subjectsService.getSubject({query})
        if(!subjectFinded) throw Boom.badRequest('Subject does not exists');
        //Creamos
        question.idSubject = ObjectId(question.idSubject)
        const createdQuestionId = await questionsService.createQuestion({question})
        res.status(201).json({
            statusCode: 201,
            data: createdQuestionId,
            message: 'Question created'
        })
    }))

    router.put('/:idQuestion', validationHandler(updateQuestionSchema), routeHelper(async(req, res)=>{
        const question = req.body
        const {idQuestion} = req.params
        //Que el id de la pregunta exista
        let query =  {_id: ObjectId(idQuestion)}
        const questionExists = await questionsService.getQuestion({query})
        if(!questionExists) throw Boom.badRequest('Question does not exists');
        //Que la pregunta aún no exista y no sea la que estamos editando
        query = {question: question.question}
        const questionFinded = await questionsService.getQuestion({query})
        if(questionFinded && questionFinded._id != idQuestion) throw Boom.badRequest('Question already exists');
        //Que la materia exista
        query = {_id: ObjectId(question.idSubject)}
        const subjectFinded = await subjectsService.getSubject({query})
        if(!subjectFinded) throw Boom.badRequest('Subject does not exists');
        //Editamos
        const updatedQuestionId = await questionsService.updateQuestion({idQuestion, question})
        res.status(201).json({
            statusCode: 201,
            data: updatedQuestionId,
            message: 'Question updated'
        })
    }))

    router.delete('/:idQuestion', routeHelper(async(req, res)=>{
        const {idQuestion} = req.params
        //Id existe
        let query = {_id: ObjectId(idQuestion)}
        let questionFinded = await questionsService.getQuestion({query})
        if(!questionFinded) throw Boom.badRequest('Question does not exist');
        //Eliminamos
        const deletedQuestionId = await questionsService.deleteQuestion({idQuestion})
        res.status(200).json({
            data: deletedQuestionId,
            message: `Question deleted`
        })
    }))

}

export default questionsApi