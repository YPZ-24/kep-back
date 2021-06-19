import * as yup from 'yup'

const emailUserSchema = yup.string().lowercase().email().trim()
const passwordUserSchema = yup.string()

export const createUserSchema = yup.object().shape({
    email: emailUserSchema.required(),
    password: passwordUserSchema.required(),
})

export const loginUserSchema = yup.object().shape({
    email: emailUserSchema.required(),
    password: passwordUserSchema.required(),
})