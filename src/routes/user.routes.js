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

}

export default usersApi