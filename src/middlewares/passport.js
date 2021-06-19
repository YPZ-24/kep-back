import {Strategy, ExtractJwt} from 'passport-jwt';
import config from '../config/config';
import {ObjectId} from 'mongodb'
import UsersService from '../services/user';

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET,
    ignoreExpiration: true
};

export default new Strategy(options, async (payload, done) => {
    try{
        const usersService = new UsersService()
        let query = {_id: ObjectId(payload._id)}
        const user = await usersService.getUser({query})
        if(user){
            return done(null, user)
        }
        return done(null, false)
    }catch(error){
        return done(error, false)
    }
})
