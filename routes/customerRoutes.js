const express = require("express")
const customerController = require("../controllers/customerController")
const {customerValidationSchema}= require("../validation/customerValidation")
const validateSchema = require("../middleware/validatemiddleware")
const router = express.Router()
const validateCustomer= validateSchema(customerValidationSchema)

router.post("/",validateCustomer ,customerController.createCustomer)
router.get("/",customerController.getAllCustomer)
router.get("/:id",customerController.getCustomerById)
router.delete("/:id",customerController.deleteCustomer)
router.put("/:id",validateCustomer,customerController.updateCustomer)

module.exports= router