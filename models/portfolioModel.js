const { model, Schema } = require("mongoose");

const PortfolioSchema = new Schema(
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
    liveLink: {
      type: String,
      required: true,
    },
    codeLink: {
      type: String,
      required: true,
    },
    tools: [{}],

    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "disapprove",
    },
  },
  { timestamps: true }
);

module.exports = model("portfolio", PortfolioSchema);
