const joi=require("joi");

const reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required(),
    }).required(),
    });

    module.exports=reviewSchema;
