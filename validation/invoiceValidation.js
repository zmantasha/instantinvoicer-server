const Joi = require("joi");

// Joi schema for invoice validation
const invoiceValidationSchema = Joi.object({
  userId: Joi.string(), 
  senderDetails: Joi.object({
    logo: Joi.string().allow("", null),
    name: Joi.string().max(50).trim().required().messages({
      "string.max": "Sender Name must be at most 50 characters",
      "any.required": "Sender Name is required",
    }),
    address: Joi.string().max(60).trim().required().messages({
      "string.max": "Sender Address must be at most 60 characters",
      "any.required": "Sender Address is required",
    }),
  }),
  
  recipientDetails: Joi.object({
    billTo: Joi.object({
      name: Joi.string().max(50).trim().required(),
      address: Joi.string().max(60).trim().required(),
    }),
    
    shipTo: Joi.object({
      name: Joi.string().max(50).trim().allow("", null),
      address: Joi.string().max(60).trim().allow("", null),
    }).allow(null),  // `shipTo` is optional, can be null
  }).required(),

  invoiceDetails: Joi.object({
    number: Joi.string().required(),
    date: Joi.date().required(),
    dueDate: Joi.date().allow(null),
    paymentTerms: Joi.string().allow("", null),
    poNumber: Joi.string().allow("", null),
    currency: Joi.string().valid("USD", "EUR", "GBP", "INR", "JPY").default("USD"),
  }),

  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        data: Joi.alternatives().try(Joi.object(), Joi.array()).required(), // Allow any object or array
        quantity: Joi.number().required().min(1),
        rate: Joi.number().required().min(0),
        amount: Joi.number().required().min(0),
      })
    )
    .min(1)
    .required(),

  totals: Joi.object({
    subtotal: Joi.number().required().min(0),
    tax: Joi.number().min(0).allow(null),
    taxRate: Joi.number().min(0).allow(null),
    igst: Joi.number().min(0).allow(null), // IGST added
    cgst: Joi.number().min(0).allow(null), // CGST added
    sgst: Joi.number().min(0).allow(null), // SGST added
    shipping: Joi.number().min(0).allow(null),
    discount: Joi.number().min(0).allow(null),
    discountType: Joi.number().min(0).allow(null),
    shippingType: Joi.string().valid("percentage", "fixed").default("percentage"),
    total: Joi.number().required().min(0),
    amountPaid: Joi.number().min(0).allow(null),
    balanceDue: Joi.number().min(0).required(),
  }).required(),

  notes: Joi.string().allow("", null),
  terms: Joi.string().allow("", null),
  status: Joi.string().allow("", null),
});

module.exports = { invoiceValidationSchema };
