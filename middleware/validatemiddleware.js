const validateSchema = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false }); // abortEarly: false to show all errors
        if (error) {
            // Return a detailed error response
            return res.status(400).json({
                success: false,
                message: error.details.map((err) => err.message).join(", "),
            });
        }
        next();
    };
};

module.exports = validateSchema;
