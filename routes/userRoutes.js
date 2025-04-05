const express= require("express");
const UserValidation = require("../validation/userValidation");
const validateSchema = require("../middleware/validatemiddleware");
const UserController = require("../controllers/userController");
const UserMiddleware = require("../middleware/userMiddleware");
const passport= require("passport")
const accessTokenAutoRefresh = require("../middleware/accessTokenAutoRefresh");
const upload = require("../middleware/FileUploder");
const verifyauthJwttoken = require("../middleware/authMiddleware");
const router= express.Router()
const singleUpload = require("../middleware/multer");
const verifyAdmin = require("../middleware/adminMiddleware")
const validateRegistrationUser=validateSchema(UserValidation.registrationValidateSchema)
const validateLoginUser=validateSchema(UserValidation.loginValidateSchema)
const validateUpdateUser=validateSchema(UserValidation.updateUserValidateSchema)
// const validateUpdateFileUser=validateSchema(UserValidation.updateUserFileValidateSchema)

// Routes
router.post("/registration",validateRegistrationUser, UserController.userRegistration)
router.post("/login",validateLoginUser,UserMiddleware.fetchEmailIncollection, UserController.userLogin)
router.post("/refresh-token", UserController.getNewAccessToken)
router.get("/",verifyauthJwttoken, UserMiddleware.fetchUserIdInCollection,verifyAdmin,UserController.getAllUsers)
router.get("/me",verifyauthJwttoken,passport.authenticate('jwt', { session: false }), UserController.userProfile)
router.put("/me/:id",validateUpdateUser,verifyauthJwttoken,passport.authenticate('jwt', { session: false }),  UserController.updateProfile)
router.put(
    "/me/avatar/:id",
    passport.authenticate("jwt", { session: false }),
    verifyauthJwttoken,
    singleUpload,
    // validateUpdateFileUser,
    UserController.updateAvatarImage
  );

// Update Logo
 router.put(
    "/me/logo/:id",
    passport.authenticate("jwt", { session: false }),
    verifyauthJwttoken,
    singleUpload,
    // validateUpdateFileUser,
    UserController.updateLogoImage
  );
router.delete("/me/:id",verifyauthJwttoken,passport.authenticate('jwt', { session: false }),  UserController.deleteProfile)
router.post("/logout",verifyauthJwttoken,passport.authenticate('jwt', { session: false }), UserController.userlogout)

module.exports= router;
