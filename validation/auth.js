const Joi = require('joi')

const registerValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(6).max(24).required(),
        password: Joi.string()
            .min(8)
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required(),
        repeatPassword: Joi.ref('password'),
    })
    return schema.validate(data)
}

const loginValidation = data => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required(),
    })
    return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
