const Blog = require("../models/Blog");
const fs = require("fs");
const path = require("path");

// Get all published blog posts
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "published" })
      .sort({ createdAt: -1 })
      .select("title slug excerpt featuredImage author tags createdAt views");
    
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Get single blog post by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: "published" });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found",
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Create new blog post
exports.createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, author, tags } = req.body;
    
    // Handle file upload
    let featuredImage = "";
    if (req.file) {
      featuredImage = req.file.filename;
    }

    const blog = await Blog.create({
      title,
      content,
      excerpt,
      featuredImage,
      author,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
    });

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update blog post
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, excerpt, author, tags, status } = req.body;
    
    let updateData = {
      title,
      content,
      excerpt,
      author,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      status,
    };

    // Handle file upload if new image is provided
    if (req.file) {
      updateData.featuredImage = req.file.filename;
      
      // Delete old image if exists
      const oldBlog = await Blog.findById(req.params.id);
      if (oldBlog && oldBlog.featuredImage) {
        const oldImagePath = path.join(__dirname, "../public/uploads/blogs", oldBlog.featuredImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete blog post
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found",
      });
    }

    // Delete featured image if exists
    if (blog.featuredImage) {
      const imagePath = path.join(__dirname, "../public/uploads/blogs", blog.featuredImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await blog.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}; 