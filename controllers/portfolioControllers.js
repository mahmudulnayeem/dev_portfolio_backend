const formidable = require("formidable");
const Portfolio = require("../models/portfolioModel")
const cloudinary = require("cloudinary").v2;


// add portfolio 
module.exports.addPortfolio = async (req, res) => {
  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    const { title, categories, codeLink, liveLink, tools, description } =
      fields;

    const error = [];
    if (!title) {
      error.push("add portfolio title");
    }
    if (!description) {
      error.push("add portfolio description");
    }
    if (!categories) {
      error.push("add portfolio categories");
    }
    if (!codeLink) {
      error.push("add portfolio codeLink");
    }
    if (!liveLink) {
      error.push("add portfolio liveLink");
    }
    if (!tools) {
      error.push("add portfolio tools");
    }
    if (Object.keys(files).length === 0) {
      error.push("please provide user image");
    }

    if (Object.keys(files).length !== 0) {
      const { size, mimetype } = files.image;
      const imageSize = size / 1000 / 1000;
      const imageType = mimetype.split("/")[1];
      if (
        imageType !== "png" &&
        imageType !== "jpg" &&
        imageType !== "jpeg" &&
        imageType !== "webp" &&
        imageType !== "jfif"
      ) {
        error.push("please only  image with 'png' 'jpg' 'jpeg' format");
      }

      if (imageSize > 8) {
        error.push("select image within 8 mb");
      }
    }

    if (error.length > 0) {
      res.status(400).json({
        error: { errorMessage: error },
      });
    } else {
      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET,
        secure: true,
      });
      const result = await cloudinary.uploader.upload(files.image.filepath);
      try {
        await Portfolio.create({
          title,
          categories,
          codeLink,
          liveLink,
          tools,
          description,
          image: result.url,
        });
        res.status(200).json({
          success: "portfolio created success",
        });
      } catch (error) {
        res.status(500).json({
          error: {
            errorMessage: ["Internal server error"],
          },
        });
      }
    }
  });
};



// get portfolio by page

module.exports.getPortfolioByPagination = async (req, res) => {
  const { page } = req.query;
  const parPage = 6;
  const skipPage = parseInt(page - 1) * parPage;
  try {
    const portfolioCount = await Portfolio.find({}).countDocuments();
    const getTPortfolio = await Portfolio.find({})
      .skip(skipPage)
      .limit(parPage)
      .sort({createdAt: -1})
    
    res.status(200).json({
      allPortfolio:getTPortfolio,
      parPage,
      portfolioCount,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
};
// all portfolio 

module.exports.getCategoriesPortfolioByPagination =async (req, res) => {
    try {
      const allWork = await Portfolio.find({}).sort({createdAt: -1})
      res.status(201).json({
        allWork
      })
    } catch (error) {
      res.status(500).json({
        error: {
          errorMessage: ["Internal server error"],
        },
      });
    }
   
}

//deletePortfolio
module.exports.deletePortfolio =async(req ,res) => {

  const {id} = req.params;

  try {
      await Portfolio.findByIdAndDelete(id)
      res.status(200).json({
        success: "Portfolio deleted success"
      })
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
}



//single  portfolio


module.exports.getSinglePortfolio = async (req , res)=>{
  const {id} = req.params;
  try {
    const singlePortfolio =await Portfolio.findById(id);
    res.status(200).json({
      singlePortfolio
    })
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
}