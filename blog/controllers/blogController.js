const Blog = require('../models/Blog');

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
  try {
    const { title, content, authorName, tags, blogImage } = req.body;

    if (!title || !content || !authorName) {
      return res.status(400).json({
        success: false,
        message: 'Title, content and authorName are required',
      });
    }

    const blog = await Blog.create({
      title,
      content,
      authorName,
      tags: Array.isArray(tags) ? tags : tags ? String(tags).split(',').map((t) => t.trim()) : [],
      blogImage,
      author: req.user._id,
    });

    res.status(201).json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all blogs (supports ?search=&tag=&page=&limit=)
// @route   GET /api/blogs
// @access  Private
const getAllBlogs = async (req, res) => {
  try {
    const { search, tag, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) query.$text = { $search: search };
    if (tag) query.tags = tag;

    const skip = (Number(page) - 1) * Number(limit);

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Blog.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      blogs,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get a single blog by ID
// @route   GET /api/blogs/:id
// @access  Private
const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.status(200).json({ success: true, blog });
  } catch (err) {
    res.status(404).json({ success: false, message: 'Blog not found' });
  }
};

// @desc    Update a blog (only by its creator)
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this blog. Only the creator can edit it.',
      });
    }

    const { title, content, authorName, tags, blogImage } = req.body;

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (authorName) blog.authorName = authorName;
    if (blogImage) blog.blogImage = blogImage;
    if (tags) {
      blog.tags = Array.isArray(tags) ? tags : String(tags).split(',').map((t) => t.trim());
    }

    await blog.save();

    res.status(200).json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a blog (only by its creator)
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this blog. Only the creator can delete it.',
      });
    }

    await blog.deleteOne();

    res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createBlog, getAllBlogs, getSingleBlog, updateBlog, deleteBlog };
