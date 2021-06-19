import { Router } from "express"
import routeHelper from "../utils/middleware/routeHelper";
import validationHandler from '../utils/middleware/validationHandler'
import Boom from '@hapi/boom'
import {ObjectId} from 'mongodb'
import SubjectsService from "../services/subject";
import { createSubjectSchema, updateSubjectSchema } from "../utils/schemas/subject";

function subjectsApi(app){
    const router = Router();
    app.use('/api/subjects', router)
    const subjectsService = new SubjectsService()

    router.get('/', routeHelper(async(req, res)=>{
        let subjects = await subjectsService.getSubjects({})
        res.status(200).json({
            statusCode: 200,
            message: 'Subjects listed',
            data: subjects,
        })
    }))

    router.post('/', validationHandler(createSubjectSchema), routeHelper(async(req, res)=>{
        const subject = req.body
        //Que la materia aún no exista
        let query = {subject: subject.subject}
        const subjectFinded = await subjectsService.getSubject({query})
        if(subjectFinded) throw Boom.badRequest('Subject already exists');
        //Creamos
        const createdSubjectId = await subjectsService.createSubject({subject})
        res.status(201).json({
            statusCode: 201,
            data: createdSubjectId,
            message: 'Subject created'
        })
    }))

    router.put('/:idSubject', validationHandler(updateSubjectSchema), routeHelper(async(req, res)=>{
        const subject = req.body
        const {idSubject} = req.params
        //Que el id de la materia exista
        let query =  {_id: ObjectId(idSubject)}
        const subjectExists = await subjectsService.getSubject({query})
        if(!subjectExists) throw Boom.badRequest('Subject does not exists');
        //Que la materia aún no exista y no sea la que estamos editando
        query = {subject: subject.subject}
        const subjectFinded = await subjectsService.getSubject({query})
        if(subjectFinded && subjectFinded._id != idSubject) throw Boom.badRequest('Subject already exists');
        //Editamos
        const updatedSubjectId = await subjectsService.updateSubject({idSubject, subject})
        res.status(201).json({
            statusCode: 201,
            data: updatedSubjectId,
            message: 'Subject updated'
        })
    }))

    router.delete('/:idSubject', routeHelper(async(req, res)=>{
        const {idSubject} = req.params
        //Id existe
        let query = {_id: ObjectId(idSubject)}
        let subjectFinded = await subjectsService.getSubject({query})
        if(!subjectFinded) throw Boom.badRequest('Subject does not exist');
        //Eliminamos
        const deletedSubjectId = await subjectsService.deleteSubject({idSubject})
        res.status(200).json({
            data: deletedSubjectId,
            message: `Subject deleted`
        })
    }))

}

export default subjectsApi