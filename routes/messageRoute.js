const { addMessage ,getMessagesByPagination , deleteMessage} = require("../controllers/messageController");

const  router = require("express").Router();

router.post("/add-message", addMessage);
router.get("/get-messages-by-pagination" , getMessagesByPagination)
router.delete("/delete-message/:id", deleteMessage)

module.exports = router;
