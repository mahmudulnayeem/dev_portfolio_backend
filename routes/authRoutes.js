const { register, login ,  logout ,getUsersByPagination , deleteUser, getMyInfo , updateMyInfo , getUserMessages , getUserOrder, deleteUserMessage, deleteUserOrder} = require("../controllers/authController");

const  router = require("express").Router();

router.post("/user-register" , register);
router.post("/user-login" ,login);
router.post("/user-logout" , logout);
router.get("/get-users-by-pagination" ,getUsersByPagination)
router.delete("/delete-user/:id" , deleteUser)
// get user info 
router.get("/get-myinfo/:id" , getMyInfo);
router.patch('/update-myinfo/:id',  updateMyInfo);
router.get('/get-user-messages/:email',  getUserMessages);
router.delete("/delete-user-message/:id" , deleteUserMessage)
router.get('/get-user-order/:email',  getUserOrder);
router.delete("/delete-user-order/:id" , deleteUserOrder)

module.exports = router;
