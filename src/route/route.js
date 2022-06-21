const express = require('express');
const router = express.Router();
const blogController= require("../controllers/blogController")
const authorController= require("../controllers/authorController")





router.post("/authors", authorController.createAuthor)
router.post("/blogs", blogController.createBlog)
router.get("/blogs", blogController.getBlogs)
router.put("/blogs/:blogId", blogController.updateBlog)



module.exports = router;