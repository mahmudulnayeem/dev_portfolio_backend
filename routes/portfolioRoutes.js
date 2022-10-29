const { addPortfolio , getPortfolioByPagination,  deletePortfolio , getCategoriesPortfolioByPagination ,getSinglePortfolio } = require("../controllers/portfolioControllers");

const  router = require("express").Router();

router.post("/add-portfolio", addPortfolio );
router.get("/get-portfolio-pagination" , getPortfolioByPagination);
router.get("/get-portfolios" , getCategoriesPortfolioByPagination);
router.delete("/delete-portfolio/:id", deletePortfolio);
router.get("/get-single-portfolio/:id" , getSinglePortfolio)
module.exports = router;
