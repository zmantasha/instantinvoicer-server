const Joi = require("joi")
class UserValidation{
    // joi Registration Validate Schema
    static registrationValidateSchema=Joi.object({
       firstName:Joi.string().required().max(50),
       lastName:Joi.string().max(50).allow(''),
    //    address:Joi.string().max(50).allow(''),
       email:Joi.string().required().email({tlds:{allow:false}}),
       password:Joi.string().required().min(8).max(16),
       confirmPassword: Joi.string().valid(Joi.ref("password")).required() 
    })
    
    // joi Login Validate Schema
    static loginValidateSchema=Joi.object().keys({
        email:Joi.string().required().email({tlds:{allow:false}}),
        password:Joi.string().required().min(8).max(16)
    })

    // joi update validation schema
    static updateUserValidateSchema= Joi.object({
        firstName:Joi.string().required().max(50),
        lastName:Joi.string().max(50).allow(''),
        address:Joi.string().trim().allow('')
    })
    // joi update validation schema
    static updateUserFileValidateSchema= Joi.object({
        avatar:Joi.string().allow(''),
        logo:Joi.string().allow('')
        
    })
}
module.exports= UserValidation
