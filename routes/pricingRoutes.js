const { addPricing , getPrichingByPagination ,DeletePricing ,getSinglePrice} = require("../controllers/pricingcontroller");


const  router = require("express").Router();

router.post("/add-pricing", addPricing );
router.get("/get-pricing-by-pagination" , getPrichingByPagination);
router.get("/get-price/:id" , getSinglePrice);
router.delete("/delete-pricing/:id" , DeletePricing);

module.exports = router;
