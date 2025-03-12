const Joi = require("joi");

// Joi validation schema for Customer
const customerValidationSchema = Joi.object({
  /** Basic Information */
  customerType: Joi.string().valid("business", "individual").required(),
  name: Joi.string().trim().required(),
  displayName: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
  workPhone: Joi.string()
    .pattern(/^[0-9]{10,15}$/) // Allows only numbers (10-15 digits)
    .allow(""), // Work phone is optional
  mobilePhone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(), // Mobile is mandatory

  /** Address Information */
  billingAddress: Joi.object({
    street1: Joi.string().trim().required(),
    street2: Joi.string().trim().allow(""), // Optional
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    pinCode: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
  }).required(),

  shippingAddress: Joi.object({
    street1: Joi.string().trim().allow(""), // Optional
    street2: Joi.string().trim().allow(""), // Optional
    city: Joi.string().trim().allow(""), // Optional
    state: Joi.string().trim().allow(""), // Optional
    pinCode: Joi.string().trim().allow(""), // Optional
    country: Joi.string().trim().allow(""), // Optional
  }).allow(null, {}), // Allow empty shipping address

  /** Business Details (Only for business customers) */
  companyName: Joi.when("customerType", {
    is: "business",
    then: Joi.string().trim().required(),
    otherwise: Joi.string().trim().allow(""),
  }),
  taxId: Joi.string().trim().allow(""), // Optional tax ID
  currency: Joi.string().trim().default("USD"),
  creditLimit: Joi.number().min(0).default(0),
  notes: Joi.string().trim().allow(""), // Optional notes

  /** Contact Persons (Only for Business Customers) */
  contacts: Joi.when("customerType", {
    is: "business",
    then: Joi.array().items(
      Joi.object({
        name: Joi.string().trim().required(),
        email: Joi.string().email().trim().required(),
        workPhone: Joi.string().pattern(/^[0-9]{10,15}$/).allow(""),
        mobilePhone: Joi.string().pattern(/^[0-9]{10,15}$/).allow(""),
        designation: Joi.string().trim().allow(""), // Job title
      })
    ),
    otherwise: Joi.array().items(Joi.any()).default([]),

  }),

  /** Invoice & Payment Details */
  invoices: Joi.array().items(Joi.string().trim()), // Array of invoice IDs
  paymentTerms: Joi.string()
    .valid("Net 30", "Net 60", "Due on Receipt")
    .default("Due on Receipt"),
  balanceDue: Joi.number().min(0).default(0),
  totalPaid: Joi.number().min(0).default(0),
  defaultPaymentMethod: Joi.string()
    .valid("Credit Card", "Bank Transfer", "Cash")
    .default("Bank Transfer"),

  /** Status & Metadata */
  status: Joi.string().valid("active", "inactive").default("active"),
  createdBy: Joi.string().trim(), // User ID (MongoDB ObjectId as string)
});

/**
 * Validate Customer Data
 */
// const validateCustomer = (data) => {
//   return customerValidationSchema.validate(data, { abortEarly: false });
// };

module.exports = {customerValidationSchema};
