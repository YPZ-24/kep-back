import * as yup from 'yup'

export const idSubjectSchema = yup.string()
const subjectSchema = yup.string().uppercase().trim()

export const createSubjectSchema = yup.object().shape({
    subject: subjectSchema.required(),
})

export const updateSubjectSchema = yup.object().shape({
    subject: subjectSchema.required(),
})

