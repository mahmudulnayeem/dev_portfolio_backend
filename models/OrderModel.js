
const { model, Schema } = require("mongoose");

const OrderSchema = new Schema(
  {
    firstName: {
      type: String,
      required:true
     
    },
    lastName: {
      type: String,
      required:true
     
    },
    phone: {
      type: Number,
      required:true
     
    },
    email: {
      type: String,
      required:true
     
    },

    image: {
      type: String,
      required:true
     
    },
    address: {
      type: String,
      required:true
     
    },

    pName: {
      type: String,
      required:true
     
    },
    pPrice: {
      type: Number,
      required:true
     
    },
    pCategories: {
      type: String,
      required:true
     
    },
    pId: {
      type: String,
      required:true
     
    },
  },
  { timestamps: true }
);

module.exports = model("order", OrderSchema);
