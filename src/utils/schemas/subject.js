import * as yup from 'yup'

export const idSubjectSchema = yup.string()
const subjectSchema = yup.string().uppercase().trim()
const urlBackgroundSchema = yup.string()

export const createSubjectSchema = yup.object().shape({
    subject: subjectSchema.required(),
    urlBackground: urlBackgroundSchema.required()
})

export const updateSubjectSchema = yup.object().shape({
    subject: subjectSchema.required(),
})

