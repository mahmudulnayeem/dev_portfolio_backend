const { Viewer ,  allLength } = require("../controllers/viewerController");

const  router = require("express").Router();

router.get("/viewers", Viewer);
router.get("/all-length", allLength)


module.exports = router;