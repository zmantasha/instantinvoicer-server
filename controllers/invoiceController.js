const InvoiceServices = require("../services/invoiceServices");
const InvoiceServiceInstance = new InvoiceServices();
const crypto = require("crypto");
const  uploadOnCloudinary = require("../utils/cloudinary");
const getDataUri = require("../utils/dataUri");
const cloudnary =require("cloudinary")
class InvoiceController {
  // Create a new invoice
  
  static createInvoice = async (req, res) => {
    try {
      // Generate a unique invoice URL
      // const invoiceUrl = this.generateInvoiceUrl(); // Call the function to generate the URL
        const {userId}=req.body
      // Add the URL to the invoice body
      // req.body.invoiceDetails.url = invoiceUrl;
      const existingInvoice = await InvoiceServiceInstance.findOne({
        "invoiceDetails.number": req.body.invoiceDetails.number,
        ...(userId && { userId: userId }) 
    });

    if (existingInvoice) {
        return res.status(400).json({ error: "Invoice number already exists" });
    }
      const invoice = await InvoiceServiceInstance.createInvoice(req.body);
      // console.log(invoice);
      res.status(201).json({ invoice, message: "Save Invoice Successfull" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


static uploadSenderLogo=async(req,res)=>{
    try {
      const filePath = req.file; // Path of the uploaded file
      if(!filePath){
        return res.status(400).json({ message: "Avatar File is missing." });
       }
       const fileUri=getDataUri(filePath)
      const mycloud=await cloudnary.v2.uploader.upload(fileUri.content)
      // console.log(mycloud)

  
      res.status(200).json({ logoUrl:mycloud.secure_url });
  } catch (error) {
    console.error("Error in upload-logo route:", error);
    res.status(500).json({ message: "Internal server error" }); 
  }
}

  // Get all invoices
  static getAllInvoices = async (req, res) => {
    try {
      const invoice = await InvoiceServiceInstance.getAllInvoices();
      res.status(200).json(invoice);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get a single invoice
  static getInvoiceById = async (req, res) => {
    try {
      const invoice = await InvoiceServiceInstance.getInvoiceById(
        req.params.id
      );
      if (!invoice)
        return res
          .status(404)
          .json({ message: "Invoice not found with this given Id" });
      res.status(200).json(invoice);
    } catch (error) {
      if (error.message.includes("Cast to ObjectId failed"))
        return res.status(404).json({ message: "invalid id" });
      res.status(500).json({ message: "oops something wents wrong" });
    }
  };

  // static get Invoice by userId
  static getInvoicebyUserId = async (req, res) => {
    try {
      // console.log(req.params.id);
      const invoice = await InvoiceServiceInstance.getInvoiceByuserId(
        req.params.id
      );
      if (!invoice)
        return res
          .status(404)
          .json({ message: "Invoice not found with this given Id" });
      res.status(200).json(invoice);
    } catch (error) {
      if (error.message.includes("Cast to ObjectId failed"))
        return res.status(404).json({ message: "invalid id" });
      res.status(500).json({ message: "oops something wents wrong" });
    }
  };

  // Update an invoice
  static updateInvoice = async (req, res) => {
    try {
      const { _id, __v, ...filteredData } = req.body;
      const invoice = await InvoiceServiceInstance.getInvoiceById(
        req.params.id
      );
      if (!invoice)
        return res
          .status(404)
          .json({ message: "Invoice not found with this given Id" });
      const updatedInvoice = await InvoiceServiceInstance.updateInvoice(
        req.params.id,
        filteredData
      );
      if (!updatedInvoice)
        return res.status(404).json({ message: "Invoice not found" });
      res.status(200).json(updatedInvoice);
    } catch (error) {
      if (error.message.includes("Cast to ObjectId failed"))
        return res.status(404).json({ message: "invalid id" });
      res.status(500).json({ message: "oops something wents wrong" });
    }
  };



  // status Update
static updateInvoicestatus = async (req, res) => {
  try {
    const { status, total, amountPaid, balanceDue } = req.body;

    const updatedInvoice = await InvoiceServiceInstance.updateInvoiceStatus(
      req.params.id, status, total, amountPaid, balanceDue
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error("Error updating invoice status:", error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
};



  // Delete an invoice
  static deleteInvoice = async (req, res) => {
    try {
      const invoice = await InvoiceServiceInstance.getInvoiceById(
        req.params.id
      );
      if (!invoice)
        return res
          .status(404)
          .json({ message: "Invoice not found with this given Id" });
      const deletedInvoice = await InvoiceServiceInstance.deleteInvoice(
        req.params.id
      );
      if (!deletedInvoice)
        return res.status(404).json({ message: "Invoice not found" });
      res.status(200).json({ message: "Invoice deleted successfully!" });
    } catch (error) {
      if (error.message.includes("Cast to ObjectId failed"))
        return res.status(404).send("invalid id");
      res.status(500).send("oops something went wrong");
    }
  };
  }





module.exports = InvoiceController;
