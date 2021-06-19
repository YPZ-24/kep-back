import * as yup from 'yup'
import {idSubjectSchema} from './subject'

const questionSchema = yup.string().trim()
const resASchema = yup.string().trim()
const resBSchema = yup.string().trim()
const resCSchema = yup.string().trim()
const resDSchema = yup.string().trim()
const resCorrectSchema = yup.string().oneOf(['A','B','C','D'])

export const createQuestionSchema = yup.object().shape({
    question: questionSchema.required(),
    resA: resASchema.required(),
    resB: resBSchema.required(),
    resC: resCSchema.required(),
    resD: resDSchema.required(),
    resCorrect: resCorrectSchema.required(),
    idSubject: idSubjectSchema.required()
})

export const updateQuestionSchema = yup.object().shape({
    question: questionSchema.required(),
    resA: resASchema.required(),
    resB: resBSchema.required(),
    resC: resCSchema.required(),
    resD: resDSchema.required(),
    resCorrect: resCorrectSchema.required(),
    idSubject: idSubjectSchema.required()
})