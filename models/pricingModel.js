const { model, Schema } = require("mongoose");

const PriceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    categories: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    features: [{}],

    color: {
      type: String,
      required: true,
    },
    grade : {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("pricing", PriceSchema);
