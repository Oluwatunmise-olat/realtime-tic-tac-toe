const router = require("express").Router();

router.get("/", (req, res, next) => {
  return res.render("index");
});

router.post("/", (req, res, next) => {
  
})

module.exports = router;
