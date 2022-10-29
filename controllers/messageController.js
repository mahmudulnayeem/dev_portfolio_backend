const Message = require("../models/messageModel");
// mesage add
module.exports.addMessage = async (req, res) => {
  const { firstName, lastName, phone, email, message, image, status } =
    req.body;
  try {
    await Message.create({
      firstName,
      lastName,
      phone,
      email,
      message,
      image,
      status,
    });
    res.status(200).json({
      success: "Message Sent Successfully , I'll Contact Soon",
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
};

// get message by paginations

module.exports.getMessagesByPagination = async (req, res) => {
  const { page } = req.query;
  const parPage = 6;
  const skipPage = parseInt(page - 1) * parPage;
  try {
    const messageCount = await Message.find({}).countDocuments();
    const getMessage = await Message.find({})
      .skip(skipPage)
      .limit(parPage)
      .sort({ createdAt: -1 });

    res.status(200).json({
      allMessage: getMessage,
      parPage,
      messageCount,
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
module.exports.deleteMessage =async(req , res) =>{
  const {id} =req.params;
  try {
    await Message.findByIdAndDelete(id)
    res.status(200).json({
      success: "Message deleted success"
    })
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: ["Internal server error"],
      },
    });
  }
}