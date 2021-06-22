import { Router } from "express"
import routeHelper from "../utils/middleware/routeHelper";
import validationHandler from '../utils/middleware/validationHandler'
import Boom from '@hapi/boom'
import {ObjectId} from 'mongodb'
import UsersService from "../services/user";
import { createUserSchema, loginUserSchema } from "../utils/schemas/user";
import passport from 'passport';
import { createJWT } from "../utils/jwt/jwt";

function usersApi(app){
    const router = Router();
    app.use('/api/users', router)
    const usersService = new UsersService()

    router.get('/logged',  passport.authenticate('jwt', {session: false}), routeHelper((req,res)=>{
        res.status(200).json({
            statusCode: 200,
            message: 'User finded',
            data: req.user
        })
    }))

    router.get('/admin', routeHelper(async (req,res)=>{
        let query = {role: 'ADMIN'}
        const users = await usersService.getUsers({query})
        res.status(200).json({
            statusCode: 200,
            message: 'Admins finded',
            data: users
        })
    }))

    router.delete('/:idUser/admin', routeHelper(async (req,res)=>{
        const {idUser} = req.params
        let query =  {_id: ObjectId(idUser)}
        const userExists = await usersService.getUser({query})
        if(!userExists) throw Boom.badRequest('User does not exists');
        let user = {role: ''}
        const updatedUserId = await usersService.updateUser({idUser, user})
        res.status(200).json({
            statusCode: 200,
            message: 'Admins deleted',
            data: updatedUserId
        })
    }))

    router.get('/:idUser', passport.authenticate('jwt', {session: false}), routeHelper(async(req, res)=>{
        const {idUser} = req.params
        let query = {_id: ObjectId(idUser)}
        const user = await usersService.getUser({query})
        res.status(200).json({
            statusCode: 200,
            message: 'User finded',
            data: user
        })
    }))

    router.post('/login', validationHandler(loginUserSchema), routeHelper(async(req, res)=>{
        const user = req.body
        let query = {email: user.email, password: user.password}
        const userFinded = await usersService.getUser({query})
        if(!userFinded) throw Boom.badRequest("Incorrect Email or Password");
        
        const token = createJWT(userFinded);
        
        res.status(200).json({
            statusCode: 200,
            message: 'You are logged in',
            data: {
                user: userFinded,
                token
            }
        })
    }))


    router.post('/', validationHandler(createUserSchema), routeHelper(async(req, res)=>{
        const user = req.body
        //Que la materia aún no exista
        let query = {email: user.email}
        const userFinded = await usersService.getUser({query})
        if(userFinded) throw Boom.badRequest('Email is already in use');
        //Creamos
        const createdUserId = await usersService.createUser({user})
        res.status(201).json({
            statusCode: 201,
            message: 'User created',
            data: createdUserId
        })
    }))

    router.put('/email/:email/role/admin', routeHelper(async(req,res)=>{
        const {email} = req.params
        let query =  {email: email}
        const userExists = await usersService.getUser({query})
        if(!userExists) throw Boom.badRequest('User does not exists');
        const user = {role: 'ADMIN'}
        const updatedUserId = await usersService.updateUser({idUser: userExists._id, user})
        res.status(200).json({
            statusCode: 200,
            message: 'User role updated',
            data: updatedUserId
        })
    }))

}

export default usersApi