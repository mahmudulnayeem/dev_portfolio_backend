const { addBlog , getBlogByPagination,getBlogForSlider, recentPost ,getSingleBlog ,deleteBlog} = require("../controllers/blogController");

const  router = require("express").Router();

router.post("/add-blog", addBlog );
router.get("/get-blog-pagination" ,getBlogByPagination)
router.get("/get-blog-for-slider" ,getBlogForSlider)
router.get("/get-blog-for-recent" ,recentPost)
router.get("/get-single-blog/:id" ,getSingleBlog)
router.delete("/delete-blog/:id", deleteBlog)

module.exports = router;
