const InvoiceModel = require("../models/InvoiceModel");

class InvoiceServices {

  // Create a new invoice
  createInvoice = async (invoiceData) => {
    try {

      const invoice = new InvoiceModel(invoiceData);
      await invoice.save();
      // Use the static method to populate userId
      // const populatedInvoice = await InvoiceModel.populateUser(invoice._id);
      // return populatedInvoice;
       return invoice;
      
    } catch (error) {
      throw error;
    }
  };
  // Get all invoices
  getAllInvoices = async () => {
    try {
      // const getAllInvoice = await InvoiceModel.find().populate("userId", "fullName email");
      const getAllInvoice = await InvoiceModel.find({}).select("-senderDetails.logo")
      return getAllInvoice;
    } catch (error) {
      throw error;
    }
  };
  // Get invoice by ID
  getInvoiceById = async (id) => {
    try {
      // const getInvoicebyId = await InvoiceModel.findById(id).populate("userId", "fullName email");
      const getInvoicebyId = await InvoiceModel.findById(id).populate("userId", "fullName email logo");;
      return getInvoicebyId;
    } catch (error) {
      throw error;
    }
  };



  // find one
      findOne=async(number)=>{
        try {
          const findOne= await InvoiceModel.findOne(number)
          return findOne
        } catch (error) {
          throw error
        }
      }
  // getInvoiceByuserId=async(userId)=>{
  //   try {
  //     const getInvoicebyuserId = await InvoiceModel.find({userId: userId })
  //     return getInvoicebyuserId;
  //   } catch (error) {
  //     throw error;
  //   }
  // }


  getInvoiceByuserId = async (userId, skip, limit) => {
    try {
      const invoices = await InvoiceModel.find({ userId })
        .skip(skip)
        .limit(limit);
  
      const total = await InvoiceModel.countDocuments({ userId });
  
      return { invoices, total };
    } catch (error) {
      throw error;
    }
  };
  

  // Update invoice
  updateInvoice = async (id, body) => {
    try {
      // console.log(body)
      const updateinvoice = await InvoiceModel.findByIdAndUpdate({ _id: id }, 
        body, 
        {new: true}
      ).populate("userId", "fullName email");
      return updateinvoice;
    } catch (error) {
      throw error;
    }
  };




  // update invoice
  updateInvoiceStatus = async (id, status, total, amountPaid, balanceDue) => {
    try {
      // console.log("Updating status:", status);
      
      const updateInvoice = await InvoiceModel.findByIdAndUpdate(
        id,  // Fixed: Pass id directly
        {
          status,
          "totals.amountPaid": amountPaid,   // Ensure totals is correctly structured
          "totals.balanceDue": balanceDue,
        },
        { new: true }
      );
  
      return updateInvoice;
    } catch (error) {
      console.error("Error in updateInvoiceStatus:", error);
      throw error;
    }
  };
  // Delete invoice
  deleteInvoice = async (id) => {
    try {
      const deleteinvoice = await InvoiceModel.findByIdAndDelete(id);
      return deleteinvoice;
    } catch (error) {
      throw error;
    }
  };

}

module.exports = InvoiceServices;
