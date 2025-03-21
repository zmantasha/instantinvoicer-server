const express = require("express")
const customerController = require("../controllers/customerController")
const {customerValidationSchema}= require("../validation/customerValidation")
const validateSchema = require("../middleware/validatemiddleware")
const verifyauthJwttoken = require("../middleware/authMiddleware")
const router = express.Router()
const validateCustomer= validateSchema(customerValidationSchema)

router.post("/",validateCustomer,verifyauthJwttoken ,customerController.createCustomer)
router.get("/",customerController.getAllCustomer)
router.get("/:id",customerController.getCustomerById)
router.get("/userId/:id",customerController.getCustomerByUserId)
router.delete("/:id",verifyauthJwttoken,customerController.deleteCustomer)
router.put("/:id",validateCustomer,verifyauthJwttoken ,customerController.updateCustomer)

module.exports= router