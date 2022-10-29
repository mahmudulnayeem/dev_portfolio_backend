const Pricing = require("../models/pricingModel");

module.exports.addPricing = async (req, res) => {
  const { title, price, categories, description, features, color, grade } =
    req.body;
  const error = [];
  if (!title) {
    error.push("add pricing title");
  }
  if (!description) {
    error.push("add pricing description");
  }
  if (!price) {
    error.push("add pricing amount");
  }
  if (!categories) {
    error.push("add pricing categories");
  }
  if (!features) {
    error.push("add pricing features");
  }
  if (!color) {
    error.push("add pricing  color");
  }
  if (!grade) {
    error.push("add pricing grade");
  }
  if (error.length > 0) {
    res.status(400).json({
      error: { errorMessage: error },
    });
  } else {
    try {
      await Pricing.create({
        title,
        price,
        categories,
        description,
        features,
        color,
        grade,
      });
      res.status(201).json({
        success: "pricing add success",
      });
    } catch (error) {
      res.status(500).json({
        error: {
          errorMessage: ["Internal server error"],
        },
      });
    }
  }
};

// pagination get
module.exports.getPrichingByPagination = async (req, res) => {
  const { page } = req.query;
  const parPage = 9;
  const skipPage = parseInt(page - 1) * parPage;
  try {
    const pricingCount = await Pricing.find({}).countDocuments();
    const getPricing = await Pricing.find({}).skip(skipPage).limit(parPage);

    res.status(200).json({
      allPricing: getPricing,
      parPage,
      pricingCount,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
};

// delete
module.exports.DeletePricing = async (req, res) => {
  const { id } = req.params;

  try {
    await Pricing.findByIdAndDelete(id);
    res.status(200).json({
      success: "User deleted success",
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
};


// get single price 

module.exports.getSinglePrice = async (req, res) => {
  const { id } = req.params;
  try {
    const singlePrice = await Pricing.findById(id);
    res.status(200).json({
      singlePrice,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
};
