import jwt from 'jsonwebtoken';
import config from '../../config/config';

export function createJWT(user){
    return jwt.sign({_id: user._id}, config.JWT_SECRET, {expiresIn: 86400});
}

