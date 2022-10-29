const { addResume ,getResume } = require("../controllers/resumeController");

const  router = require("express").Router();

router.post("/add-resume", addResume );

router.get("/get-resume", getResume);

module.exports = router;