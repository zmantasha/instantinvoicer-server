const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    /** Basic Information */
    customerType: { type: String, enum: ["business", "individual"], required: true }, // Business or Individual
    firstName: { type: String, required: true, trim: true }, // Full Name / Company Name
    lastName: { type: String, required: true, trim: true }, // Full Name / Company Name
    displayName: { type: String, required: true, trim: true }, // How to display customer name
    email: { type: String, required: true, trim: true },
    workPhone: { type: String, trim: true }, // Work number
    mobilePhone: { type: String, trim: true }, // Mobile number

    /** Address Information */
    billingAddress: {
      street1: { type: String, required: true }, // Main street
      street2: { type: String, trim: true }, // Optional second street
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    shippingAddress: {
      street1: { type: String, trim: true },
      street2: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pinCode: { type: String, trim: true },
      country: { type: String, trim: true },
    },

    /** Business Details (If applicable) */
    companyName: { type: String, trim: true }, // Only for business customers
    taxId: { type: String, sparse: true, trim: true }, // GST/VAT/TIN (optional)
    currency: { type: String, default: "USD" }, // Default currency
    creditLimit: { type: Number, default: 0 }, // Allowed credit limit
    notes: { type: String, trim: true }, // Additional customer notes

    /** Contact Persons (Only for Business Customers) */
    contacts: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true, trim: true },
        workPhone: { type: String, trim: true },
        mobilePhone: { type: String, trim: true },
        designation: { type: String, trim: true }, // Job title (e.g., Manager)
      },
    ],

    /** Invoice & Payment Details */
    invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }], // Reference to invoices
    // paymentTerms: { type: String, enum: ["Net 30", "Net 60", "Due on Receipt"], default: "Due on Receipt" },
    balanceDue: { type: Number, default: 0 }, // Unpaid invoice balance
    totalPaid: { type: Number, default: 0 }, // Total amount paid
    // defaultPaymentMethod: { type: String, enum: ["Credit Card", "Bank Transfer", "Cash"], default: "Bank Transfer" },

    /** Status & Metadata */
    status: { type: String, enum: ["active", "inactive"], default: "active" }, // Active or inactive customer
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" ,require:true}, // Who created this customer
  },
  { timestamps: true } // Auto-generate createdAt & updatedAt fields
);

CustomerSchema.index({ email: 1, createdBy: 1 }, { unique: true });
const customerModel = mongoose.model("Customer", CustomerSchema);

module.exports = customerModel;
