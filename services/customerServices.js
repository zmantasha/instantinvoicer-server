
const customerModel = require("../models/customerModel");
const InvoiceModel = require("../models/InvoiceModel");


class CustomerServices{
    createCustomer = async(customerData)=>{
        try {
          const customer = new customerModel(customerData)  
          await  customer.save()
          return customer
        } catch (error) {
            throw error;
        }
    }

   getAllCustomer = async()=>{
        try {
           const getAllCustomer= await customerModel.find({}).populate("createdBy","-password")
           return getAllCustomer 
        } catch (error) {
           throw error 
        }
    }
    getCustomerById=async(id)=>{
       try {
        const getCustomerById= await customerModel.findById(id).populate("createdBy","-password") .populate({
          path: "invoices",
          model: "invoice",
        });
        if (!getCustomerById) {
          throw new Error("Customer not found");
        }
        return getCustomerById
       } catch (error) {
        throw error
       }
    }

    getCustomerByUserId = async(id)=>{
      try {
        console.log(id)
        const getCustomerByUserId = await customerModel.find({createdBy:id} );
        // console.log(getCustomerByUserId)
        return getCustomerByUserId
      } catch (error) {
        throw error
      }
    }

     updateCustomer= async(id,body)=>{
        try {
          const updateCustomer= await customerModel.findByIdAndUpdate({_id:id},body,{new:true})  
          return updateCustomer; 
        } catch (error) {
          throw error;  
        }
     }

    deleteCustomer =async(id)=>{
      try {
        // await InvoiceModel.deleteMany({ customer: id });
        const deleteCustomer= await customerModel.findByIdAndDelete(id);
        return deleteCustomer;
      } catch (error) {
        throw error
      }
    }
}

module.exports= CustomerServices