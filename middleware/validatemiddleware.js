const validateSchema = (schema) => {
    return (req, res, next) => {
        const { error,value } = schema.validate(req.body, { abortEarly: false,stripUnknown: true }); // abortEarly: false to show all errors
        if (error) {
            // Return a detailed error response
            return res.status(400).json({
                success: false,
                message: error.details.map((err) => err.message).join(", "),
            });
        }
        req.body=value
        next();
    };
};

module.exports = validateSchema;
