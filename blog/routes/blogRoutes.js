const express = require('express');
const {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All blog routes require a logged-in user with a valid JWT
router.use(protect);

router.route('/').get(getAllBlogs).post(createBlog);
router.route('/:id').get(getSingleBlog).put(updateBlog).delete(deleteBlog);

module.exports = router;
