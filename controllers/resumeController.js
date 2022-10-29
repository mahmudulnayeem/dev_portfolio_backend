const Resume = require("../models/resumeModel");


// add resme 
module.exports.addResume = async (req, res) => {
  const { link } = req.body;
  const error = [];
  if (!link) {
    error.push("add link");
  }
  try {
    await Resume.create({
      link,
    });
    res.status(200).json({
      success: "resume created success",
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
};


// get resume 
module.exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.find().sort({
      createdAt: -1
    }).limit(1);
    res.status(200).json({
      resume,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
};


// delete resume 