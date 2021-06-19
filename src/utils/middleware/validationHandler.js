import boom from '@hapi/boom'

function validationHandler(schema, check='body'){
    return function(req, res, next){
        schema.validate(req[check], {strict: false}).then((e)=>{
            req[check] = e
            next()
        }).catch((error)=>{
            next(boom.badRequest(error))
        })
    }
}

export default validationHandler