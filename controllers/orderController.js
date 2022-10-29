const formidable = require("formidable");
const Order = require("../models/OrderModel");

// ad  orders
module.exports.addOrder = async (req, res) => {
  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      image,

      pName,
      pPrice,
      pCategories,
      pId,
    } = fields;

    try {
      const checkEmail = await Order.findOne({ email: email });
      if (checkEmail) {
        res
          .status(404)
          .json({
            error: {
              errorMessage: [
                "You have already created an order.You have no option to make double order. Contact me!",
              ],
            },
          });
      } else {
        await Order.create({
          firstName,
          lastName,
          phone,
          email,
          address,
          image,

          pName,
          pPrice,
          pCategories,
          pId,
        });
        res.status(200).json({
          success: "You've successfully make an order. I'll response within 48 hours. Be patience",
        });
      }
    } catch (error) {
      res.status(500).json({
        error: {
          errorMessage: ["Internal server error"],
        },
      });
    }
  });
};


// get all orders by page 

module.exports.getOrdersByPagination = async( req , res )=>{
  const { page } = req.query;
  const parPage = 6;
  const skipPage = parseInt(page - 1) * parPage;
  try {
    const orderCount = await Order.find({}).countDocuments();
    const getOrder = await Order.find({})
      .skip(skipPage)
      .limit(parPage)
      .sort({updatedAt:-1})
    
    res.status(200).json({
      allOrder: getOrder,
      parPage,
      orderCount,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }

}


// delete 
module.exports.deleteOrder = async(req ,res) => {

  const {id} = req.params;

  try {
      await Order.findByIdAndDelete(id)
      res.status(200).json({
        success: "Order deleted success"
      })
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
}