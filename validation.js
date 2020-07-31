const joi = require('@hapi/joi');
const { join } = require('path');

const registerValidation = (data)=>{
    const schema = {
        username: joi.string()
                    .min(5)
                    .max(24)
                    .required(),
        password: joi.string()
                    .min(6)
                    .max(1024)
                    .required(),
        email: joi.string()
                    .min(6)
                    .email()
                    .required()
    };
    return joi.validate(data, schema);
};

const loginValidation = (data)=>{
    const schema = {
        username: joi.string()
                    .min(5)
                    .max(24)
                    .required(),
        password: joi.string()
                    .min(6)
                    .max(1024)
                    .required()
    };
    return joi.validate(data, schema);
};

const quoteValidation = (data)=>{
    const schema = {
        content: joi.string()
                    .required()
    };
    return joi.validate(data, schema);
};

const quoteRateValidation = (data) => {
    return joi.validate(data, {
        mark: joi.boolean().required()
    });
}

const commentValidation = (data)=>{
    return joi.validate(data, {
        content: joi.string().required()
    })
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.quoteValidation = quoteValidation;
module.exports.quoteRateValidation = quoteRateValidation;
module.exports.commentValidation = commentValidation;