const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

// ROUTE:1 - Fetch blog list. method: GET.
blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({});
    res.json(blogs);
});

// ROUTE:2 - Add blog. method: POST.
blogsRouter.post('/', async (req, res) => {
    const blog = new Blog(req.body)
    const result = await blog.save();
    res.status(200).json(result);
});

// ROUTE:3 - Delete blog. method: DELETE.
blogsRouter.delete('/:id', async (req,res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);
  if(!blog) {
    return res.status(400).send("Not Found");
  }
  await Blog.findByIdAndDelete(id);
  res.status(200).json({success: true});
});

// ROUTE:4 - Update blog. method: PUT.
blogsRouter.put('/:id', async (req,res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);
  if(!blog) {
    return res.status(400).send("Not Found");
  }
  const {title, author, url, likes} = req.body;
  const newBlog = {};
  if(title){newBlog.title = title};
  if(author){newBlog.author = author};
  if(url){newBlog.url = url};
  if(likes){newBlog.likes = likes};

  let updateBlog = await Blog.findByIdAndUpdate(id, {$set: newBlog}, {new: true});
  res.json(updateBlog);
})

module.exports = blogsRouter;