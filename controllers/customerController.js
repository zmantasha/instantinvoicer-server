const CustomerServices= require("../services/customerServices")
const CustomerServicesInstance = new CustomerServices()
class CustomerController {
    static createCustomer = async(req,res)=>{
         try {
           const customer= await CustomerServicesInstance.createCustomer(req.body) 
           res.status(201).json({customer, messsage:"save customer successfull"})
         } catch (error) {
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

    static getCustomerByUserId = async()=>{
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
        const updateCustomer = await CustomerServicesInstance.updateCustomer(req.params.id,req.body);
        if(!updateCustomer){
            return res.status(404).json({message:"Update failed. No change made."});
        } 
        res.status(200).json({updateCustomer, message});
        } catch (error) {
            console.log("Error updating profile:", error);
          res.status(500).json({message:"oops something went wrong"})  
        }
    }

    static deleteCustomer= async(req,res)=>{
        try {
           const customer = await CustomerServicesInstance.getCustomerById(req.params.id)
           if(!customer)
            return res.status(404).json({message:"customer not fount with this given ID"});
            const deleteCustomer = await CustomerServicesInstance.deleteCustomer(req.params.id)
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