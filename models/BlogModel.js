const { model, Schema } = require("mongoose");

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tagItems: [{}],

    image: {
      type: String,
      required: true,
    },
    status:{
      type:String,
      default:"disapprove"
    }
  },
  { timestamps: true }
);

module.exports = model("blog", BlogSchema);
