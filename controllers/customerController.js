const customerModel = require("../models/customerModel");
const CustomerServices= require("../services/customerServices")
const UserServices= require("../services/userServices")
const UserServicesInstance= new UserServices()
const CustomerServicesInstance = new CustomerServices()
class CustomerController {
    static createCustomer = async(req,res)=>{
         try {
         
          if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Unauthorized: Invalid or missing token" });
        }
        let userId = req.user?.userId || null; // Get user ID if available

        if (userId) {
            // Find the user
            const user = await UserServicesInstance.findUserbyId(userId);
            if (!user) {
                userId = null; // If user not found, set to null
            }
        }
         // Check if the email already exists for the same user
            const existingCustomer = await customerModel.findOne({
              email: req.body.email,
              ...(userId && { createdBy: userId }) // Only filter by createdBy if userId exists
          });

          if (existingCustomer) {
              return res.status(400).json({
                  message: "This email is already registered as a customer under your account."
              });
          }

      // Attach the user ID to the customer data only if user exists
          if (userId) {
              req.body.createdBy = userId;
          }
          // req.body.createdBy = req.user.userId;
           const customer= await CustomerServicesInstance.createCustomer(req.body) 
          //  const user = await userModel.findById(req.user.userId);
          //  if (!user) {
          //      return res.status(404).json({ message: "User not found" });
          //  }
   
          //  user.customer.push(customer);
          if (userId) {
            await UserServicesInstance.updateUser(
                userId,
                { $push: { customer: customer._id } },
                { new: true }
            );
        }
           res.status(201).json({customer, messsage:"save customer successfull"})
         } catch (error) {
          if (error.code === 11000) {
            return res.status(400).json({ message: `Customer with this ${Object.keys(error.keyPattern)[0]}  already exists for this user` });
          }
           res.status(500).json({error:error.message}) 
         }
    }


    static searchByCustomerDisplayName=async(req,res)=>{
       try {
        const { displayName, firstName } = req.query; 
        const query=[]
        if(displayName){
          query.push({displayName:{$regex:new RegExp(displayName,"i")}})
        }
        if(firstName){
          query.push({firstName:{$regex:new RegExp(firstName,"i")}})
        }
        if(query.length===0){
          return req.status(400).json({message:"please provide a displayName and firstName to search"})
        }
        const customer= await customerModel.find({
          $or:query
        });
        res.send(customer)
       } catch (error) {
        console.log(error)
        res.status(500).json({error:error.message}) 
       }
    }


    static getAllCustomer = async(req,res)=>{
        try{
          const customer = await CustomerServicesInstance.getAllCustomer();
          res.status(200).json(customer)
        }catch(error){
            console.log(error)
          res.status(500).json({error:error.message})  
        }
    }
    static getCustomerById=async(req,res)=>{
        try {
           const customer= await CustomerServicesInstance.getCustomerById(req.params.id) 
           if(!customer)
            return res.status(404).json({message:"Customer not found with this given ID"})
           res.status(200).json(customer)
        } catch (error) {
            console.log(error)
            res.status(500).json({error:error.message})
        }
    }

    static getCustomerByUserId = async(req,res)=>{
      try {
        const customer = await CustomerServicesInstance.getCustomerByUserId(req.params.id)
        if(!customer)
          return res.status(404).json({message:"Customer not found with this given Id"})
        res.status(200).json(customer)
      } catch (error) {
        res.status(500).json({error:error.message})
      }
    }

    static updateCustomer=async(req,res)=>{
        try {
         const customer = await CustomerServicesInstance.getCustomerById(req.params.id)
         if(!customer)
            return res.status(404).json({message:"Customer not found with this given ID"})  

         if (!req.user || !req.user.userId) {
          return res.status(401).json({ message: "Unauthorized: Invalid or missing token" });
      }
        req.body.createdBy = req.user.userId;
        const updateCustomer = await CustomerServicesInstance.updateCustomer(req.params.id,req.body);
        if(!updateCustomer){
            return res.status(404).json({message:"Update failed. No change made."});
        } 
        res.status(200).json({updateCustomer,  messsage:"update customer successfull"});
        } catch (error) {
            console.log("Error updating profile:", error);
          res.status(500).json({message:"oops something went wrong"})  
        }
    }

    static deleteCustomer= async(req,res)=>{
        try {
          const customerId  = req.params.id;
          const userId=req.user.userId
           const customer = await CustomerServicesInstance.getCustomerById(customerId)
           if(!customer)
            return res.status(404).json({message:"customer not fount with this given ID"});
            const deleteCustomer = await CustomerServicesInstance.deleteCustomer({ _id: customerId, user: userId })
            if(!deleteCustomer)
                return res.status(404).json({message:"invoice not found"})
            
           res.status(200).json({message:"Customer delete successfully"})
        } catch (error) {
          console.log(error)  
          res.status(500).json({error:error.message})
        }
    }

}

module.exports= CustomerController