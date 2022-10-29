const { addOrder ,deleteOrder , getOrdersByPagination} = require("../controllers/orderController");


const  router = require("express").Router();

router.post("/add-order", addOrder);
router.get("/get-orders-by-pagination" ,getOrdersByPagination)
router.delete("/delete-order/:id" , deleteOrder)

module.exports = router;
