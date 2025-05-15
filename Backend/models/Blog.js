const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from title before saving
blogSchema.pre("save", function (next) {
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-");
  next();
});

module.exports = mongoose.model("Blog", blogSchema); 