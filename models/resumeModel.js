const { model, Schema } = require("mongoose");

const ResumeSchema = new Schema(
  {
    link: {
      type: String,
      required: true,
    },
   
  },
  { timestamps: true }
);

module.exports = model("resume",  ResumeSchema);
