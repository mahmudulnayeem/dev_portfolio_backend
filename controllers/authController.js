const formidable = require("formidable");
const registerModel = require("../models/AuthModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const Order = require("../models/OrderModel");
const Message = require("../models/messageModel")

//register

module.exports.register = async (req, res) => {
  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    const { firstName, lastName, phone, email, password } = fields;

    const error = [];

    if (!firstName) {
      error.push("add first name");
    }
    if (!lastName) {
      error.push("add last name");
    }

    if (!phone) {
      error.push("add phone number");
    }

    if (!email) {
      error.push("add  email");
    }

    if (!password) {
      error.push("add  password");
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

      const checkUser = await registerModel.findOne({ email: email });
      if (checkUser) {
        res
          .status(404)
          .json({ error: { errorMessage: ["Your email already exits"] } });
      } else {
        try {
          const userCreate = await registerModel.create({
            firstName,
            lastName,
            phone,
            email,
            password: await bcrypt.hash(password, 10),
            image: result.url,
          });

          const token = jwt.sign(
            {
              id: userCreate._id,
              email: userCreate.email,
              firstName: userCreate.firstName,
              lastName: userCreate.lastName,
              phone: userCreate.phone,
              image: userCreate.image,
              status: userCreate.status,
              registerTime: userCreate.createdAt,
            },
            process.env.SECRET,
            {
              expiresIn: process.env.TOKEN_EXP,
            }
          );
          const option = {
            expires: new Date(Date.now() + 366 * 24 * 60 * 60 * 1000),
          };

          res.status(201).cookie("authToken", token, option).json({
            successMessage: "Your register successful",
            token,
          });
        } catch (error) {
          res.status(500).json({
            error: {
              errorMessage: ["Internal server error"],
            },
          });
        }
      }
    }
  });
};

// login
module.exports.login = async (req, res) => {
  const error = [];
  const { email, password } = req.body;

  if (!email) {
    error.push("Please provide your email");
  }
  if (!password) {
    error.push("Please provide your password");
  }

  if (error.length > 0) {
    res.status(400).json({
      error: {
        errorMessage: error,
      },
    });
  } else {
    try {
      const checkUser = await registerModel
        .findOne({
          email: email,
        })
        .select("+password");

      if (checkUser) {
        const matchPassword = await bcrypt.compare(
          password,
          checkUser.password
        );

        if (matchPassword) {
          const token = jwt.sign(
            {
              id: checkUser._id,
              email: checkUser.email,
              firstName: checkUser.firstName,
              lastName: checkUser.lastName,
              phone: checkUser.phone,
              image: checkUser.image,
              registerTime: checkUser.createAt,
            },
            process.env.SECRET,
            {
              expiresIn: process.env.TOKEN_EXP,
            }
          );

          const options = {
            expires: new Date(
              Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
            ),
          };

          res.status(200).cookie("authToken", token, options).json({
            successMessage: "Your login successfull",
            token,
          });
        } else {
          res.status(400).json({
            error: {
              errorMessage: ["your password not valid"],
            },
          });
        }
      } else {
        res.status(400).json({
          error: {
            errorMessage: ["your email not found"],
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        error: {
          errorMessage: ["Internal server error"],
        },
      });
    }
  }
};

// log out
module.exports.logout = (req, res) => {
  res.status(200).cookie("authToken", "").json({
    success: true,
  });
};

// get users by pagination ,getUsersByPagination
module.exports.getUsersByPagination = async (req, res) => {
  const { page } = req.query;
  const parPage = 6;
  const skipPage = parseInt(page - 1) * parPage;
  try {
    const userCount = await registerModel.find({}).countDocuments();
    const getUser = await registerModel
      .find({})
      .skip(skipPage)
      .limit(parPage)
      .sort({ updatedAt: -1 });

    res.status(200).json({
      allUser: getUser,
      parPage,
      userCount,
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
module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await registerModel.findByIdAndDelete(id);
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

// *** users profile managemnet ***//

// get single user details
module.exports.getMyInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const myInfo = await registerModel.findById(id);
    res.status(200).json({
      myInfo,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
};
//update

module.exports.updateMyInfo = async (req, res) => {
  const { id } = req.params;
  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    const { firstName, lastName, phone, email } = fields;

    const error = [];

    if (!firstName) {
      error.push("add first name");
    }
    if (!lastName) {
      error.push("add last name");
    }

    if (!phone) {
      error.push("add phone number");
    }

    if (!email) {
      error.push("add  email");
    }

    if (error.length > 0) {
      res.status(400).json({
        error: { errorMessage: error },
      });
    } else {
      try {
        await registerModel.findByIdAndUpdate(id, {
          firstName,
          lastName,
          phone,
          email,
        });

        res.status(200).json({
          successMessage: "Your profile update successfull",
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

// get user messages

module.exports.getUserMessages = async (req, res) => {
  const { email } = req.params;
  try {
    const myMessages = await Message.find({ email: email }).sort({createdAt : -1});
    res.status(200).json({
      myMessages
    })
  } catch (error) {}
};

// delete messages 
module.exports.deleteUserMessage = async (req, res) => {
  const { id } = req.params;

  try {
    await Message.findByIdAndDelete(id);
    res.status(200).json({
      success: "Your message deleted success",
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
};

// getUserOrder

module.exports.getUserOrder = async (req, res) => {
  const { email } = req.params;
  try {
    const myOrder = await Order.find({ email: email }).sort({createdAt : -1});
    res.status(200).json({
      myOrder
    })
  } catch (error) {}
};

// delete order 
module.exports.deleteUserOrder = async (req, res) => {
  const { id } = req.params;

  try {
    await Order.findByIdAndDelete(id);
    res.status(200).json({
      success: "Your order canceled success",
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
};