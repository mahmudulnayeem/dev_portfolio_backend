const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const Blog = require("../models/BlogModel");

// add blog
module.exports.addBlog = async (req, res) => {
  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    const { title, description, tagItems } = fields;
    const error = [];
    if (!title) {
      error.push("add blog title");
    }
    if (!description) {
      error.push("add blog description");
    }
    if (!tagItems) {
      error.push("add blog tags");
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
        await Blog.create({
          title,
          description,
          tagItems,
          image: result.url,
        });
        res.status(200).json({
          success: "blog created success",
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

// get blogs by page

module.exports.getBlogByPagination = async (req, res) => {
  const { page } = req.query;
  const parPage = 6;
  const skipPage = parseInt(page - 1) * parPage;
  try {
    const blogCount = await Blog.find({}).countDocuments();
    const getTBlog = await Blog.find({})
      .skip(skipPage)
      .limit(parPage)
    
    res.status(200).json({
      allBlog: getTBlog,
      parPage,
      blogCount,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
};


// getBlogForSlider

module.exports.getBlogForSlider =async (req, res)=>{
  try {
    const  allSliderBlogs =await Blog.find({})
    res.status(200).json({
      allSliderBlogs
    })

  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
}


//recent two post

module.exports.recentPost =async (req, res)=>{
  try {
    const  recentPost = await Blog.find({})
    .sort({createdAt: -1})
    .limit(2)
    res.status(200).json({
      recentPost
    })

  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
}


//single blog


module.exports.getSingleBlog =async (req , res)=>{
  const {id} = req.params;
  try {
    const singlePost =await Blog.findById(id);
    res.status(200).json({
      singlePost
    })
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
}

// deleteBlog
module.exports.deleteBlog =async(req ,res) => {

  const {id} = req.params;

  try {
      await Blog.findByIdAndDelete(id)
      res.status(200).json({
        success: "Blog deleted success"
      })
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
}