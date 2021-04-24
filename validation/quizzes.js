const Joi = require('joi')

const createQuizValidation = data => {
    const schema = Joi.object({
        author: Joi.string().required(),
        name: Joi.string().min(8).max(64).required(),
        thumbnail: Joi.string().required(),
        categories: Joi.array().items(Joi.string().min(2)).required(),
        data: Joi.array()
            .items(
                Joi.object({
                    question: Joi.string().required(),
                    answers: Joi.array().items(
                        Joi.object({
                            answer: Joi.string().required(),
                            isCorrect: Joi.boolean().required(),
                        }),
                    ),
                }),
            )
            .min(3)
            .max(16),
    })
    return schema.validate(data)
}

module.exports.createQuizValidation = createQuizValidation
