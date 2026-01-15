const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
    if (blog) {
        response.status(200).json(blog.toJSON())
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    
    // Title and URL verification
    if (!body.title || !body.url)
        return response.status(400).json({ error: 'title and url are required' })

    if (!request.user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: request.user._id,
        comments: body.comments || []
    })

    const savedBlog = await blog.save()
    request.user.blogs = request.user.blogs.concat(savedBlog._id)
    await request.user.save()

    const populatedBlog = await Blog
        .findById(savedBlog._id)
        .populate('user', { username: 1, name: 1 })

    response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {

    if (!request.user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(request.params.id)

    // Blog existence verification
    if (!blog) {
        return response.status(404).end()
    }

    // Blog ownership verification
    if (blog.user.toString() !== request.user._id.toString()) {
        return response.status(403).json({ error: 'only the creator can delete a blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    request.user.blogs = request.user.blogs.filter(b => b.toString() !== request.params.id)
    await request.user.save()

    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(400).end()
    }

    blog.title = body.title
    blog.author = body.author
    blog.url = body.url
    blog.likes = body.likes
    blog.comments = body.comments || blog.comments

    const updatedBlog = await blog.save()
    response.status(200).json(updatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
    const { comment } = request.body
    const blog = await Blog.findById(request.params.id)
    if (!blog || !comment) {
        return response.status(400).end()
    }
    blog.comments = blog.comments.concat(comment)
    const updatedBlog = await blog.save()
    response.status(201).json(updatedBlog)
})

module.exports = blogsRouter