// const mongoose = require("mongoose");

// const InvoiceSchema = new mongoose.Schema({
//   // userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
//   businessName: { type: String, required: true },
//   businessAddress: { type: String, required: true },
//   billTo: { type: String, required: true },
//   billingAddress: { type: String, required: true },
//   shippingRecipient: { type: String },
//   shippingAddress: { type: String },
//   invoiceNumber: { type: String, required: true },
//   date: { type: Date, required: true },
//   paymentTerms: { type: String },
//   dueDate: { type: Date },
//   poNumber: { type: String },
//   items: [
//     {
//       itemDescription: { type: String },
//       quantity: { type: Number },
//       rate: { type: Number },
//       amount: { type: Number },
//     },
//   ],
//   notes: { type: String },
//   terms: { type: String },
//   subtotal: { type: Number },
//   tax: { type: Number },
//   discount: { type: Number },
//   shipping: { type: Number },
//   total: { type: Number },
//   amountPaid: { type: Number },
//   balanceDue: { type: Number },
// });

// // Add an instance method to populate userId
// InvoiceSchema.statics.populateUser = async function (invoiceId) {
//   return await this.findById(invoiceId).populate("userId", "fullName email");
// };

// const InvoiceModel = mongoose.model("Invoice", InvoiceSchema);

// module.exports = InvoiceModel;

const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
 userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  senderDetails: {
    logo: { type: String, default: "" },
    name: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  recipientDetails: {
    billTo: {
      name: { type: String, default: "" },
      address: { type: String, default: "" },
    },
    shipTo: {
      name: { type: String, default: "" },
      address: { type: String, default: "" },
    },
  },
  invoiceDetails: {
    number: { type: String, required: true },
    date: { type: Date, default: Date.now },
    dueDate: { type: Date, default: null },
    paymentTerms: { type: String, default: "" },
    poNumber: { type: String, default: "" },
    currency: { type: String, default: "USD" },
  },
  items: [
    {
id: { type: String, required: true, default: () => crypto.randomUUID() }, // id generated using crypto.randomUUID()
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      rate: { type: Number, required: true },
      amount: { type: Number, required: true },
    },
  ],
  totals: {
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discountType: { type: Number, default: 0 },
    shippingType: { type: String, default: "percentage" },
    total: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
  },
  notes: { type: String, default: "" },
  terms: { type: String, default: "" },
  status:{type: String, default: "pending"}
});

// // Add an instance method to populate userId
InvoiceSchema.statics.populateUser = async function (invoiceId) {
  return await this.findById(invoiceId).populate("userId", "fullName email");
};
const InvoiceModel = mongoose.model("Invoice", InvoiceSchema);

module.exports = InvoiceModel;
