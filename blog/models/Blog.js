const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    authorName: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    blogImage: {
      type: String,
      default: 'https://placehold.co/800x450?text=Blog',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

BlogSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Blog', BlogSchema);
