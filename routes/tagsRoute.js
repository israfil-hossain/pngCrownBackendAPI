

// external imports
const express = require("express");

const router = express.Router(); 

const { 
  addTags,
  getTags
 } =
  require("../controller/tagsController");

    // get All Tags
    router.get("/",getTags)

  // For Tag Category
  router.post("/addtags",addTags);
  




module.exports = router;
