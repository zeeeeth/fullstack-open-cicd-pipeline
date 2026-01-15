const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const api = supertest(app)
let tokenForUserWithBlogs = null

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const users = await User.insertMany(helper.hashedInitialUsers)
    await Blog.insertMany(
        helper.initialBlogs.map(blog => ({...blog, user: users[0]._id}))
    )

    tokenForUserWithBlogs = jwt.sign(
        { username: users[0].username, id: users[0]._id },
        process.env.SECRET
    )
})

describe('With initial blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('returns correct amount of blogs', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('verifies that the unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach(blog => {
            assert.ok(blog.id)
            assert.strictEqual(blog._id, undefined)
        })
    })

    test('able to get a specific blog by id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]
        const response = await api
                        .get(`/api/blogs/${blogToView.id}`)
                        .expect(200)
                        .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.id, blogToView.id)
    })

    test('returns 404 with well-formed id that does not exist', async () => {
        const validButMissingId = await helper.nonExistingId()
        await api
            .get(`/api/blogs/${validButMissingId}`)
            .expect(404)
    })

    test('returns 400 with malformatted id', async () => {
        const malformattedId = '12345'
        await api
            .get(`/api/blogs/${malformattedId}`)
            .expect(400)
    })
})

describe('posting a blog', () => {

    test('increases the total number of blogs by one', async () => {
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${tokenForUserWithBlogs}`)
            .send(helper.validBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    })

    test('posts a blog with the correct contents', async () => {
        const response = await api
                            .post('/api/blogs')
                            .set('Authorization', `Bearer ${tokenForUserWithBlogs}`)
                            .send(helper.validBlog)
                            .expect(201)
        const newBlog = response.body
        delete newBlog.id
        delete newBlog.user
        assert.deepStrictEqual(newBlog, helper.validBlog)
    })

    test('with likes missing defaults to the value 0', async () => {
        const response = await api
                            .post('/api/blogs')
                            .set('Authorization', `Bearer ${tokenForUserWithBlogs}`)
                            .send(helper.blogWithoutLikes)
                            .expect(201)
        const newBlog = response.body
        assert.strictEqual(newBlog.likes, 0)
    })

    test('with missing title responds with status code 400', async () => {
        const response = await api
                            .post('/api/blogs')
                            .set('Authorization', `Bearer ${tokenForUserWithBlogs}`)
                            .send(helper.blogWithoutTitle)
                            .expect(400)
    })

    test('with missing Url responds with status code 400', async () => {
        const response = await api
                            .post('/api/blogs')
                            .set('Authorization', `Bearer ${tokenForUserWithBlogs}`)
                            .send(helper.blogWithoutUrl)
                            .expect(400)
    })

    test('without token responds with status code 401', async () => {
        const response = await api
                            .post('/api/blogs')
                            .send(helper.validBlog)
                            .expect(401)
    })

    test('creates a blog associated with the user', async () => {
        const usersAtStart = await helper.usersInDb()
        const user = usersAtStart[0]

        // make a token for that user
        const token = jwt.sign(
            { username: user.username, id: user.id },
            process.env.SECRET
        )

        const newBlog = {
            title: 'associated blog',
            author: 'me',
            url: 'http://example.com',
            likes: 7,
            comments: ['Nice post!', 'Thanks for sharing.']
        }

        const created = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        // 1) blog.user is set
        assert.strictEqual(created.body.user.id.toString(), user.id.toString())

        // 2) user.blogs contains the blog id
        const usersAtEnd = await helper.usersInDb()
        const updatedUser = usersAtEnd.find(u => u.id === user.id)

        assert.ok(updatedUser.blogs.map(b => b.toString()).includes(created.body.id.toString()))
    })
})

describe('updating a blog', () => {
    test('successfully updates the blog\'s information', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const updatedData = {
            title: 'Updated Title',
            author: 'Updated Author',
            url: 'http://updatedurl.com',
            likes: blogToUpdate.likes + 1,
            comments: blogToUpdate.comments.concat(['New comment!'])
        }
        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedData)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const updatedBlog = response.body
        assert.strictEqual(updatedBlog.title, updatedData.title)
        assert.strictEqual(updatedBlog.author, updatedData.author)
        assert.strictEqual(updatedBlog.url, updatedData.url)
        assert.strictEqual(updatedBlog.likes, updatedData.likes)
        assert.deepStrictEqual(updatedBlog.comments, updatedData.comments)
    })

    test('returns 400 when trying to update a non-existing blog', async () => {
        const validButMissingId = await helper.nonExistingId()
        const updatedData = {
            title: 'Updated Title',
            author: 'Updated Author',
            url: 'http://updatedurl.com',
            likes: 10,
            comments: ['New comment!']
        }
        await api
            .put(`/api/blogs/${validButMissingId}`)
            .send(updatedData)
            .expect(400)
    })
})

describe('adding comments to a blog', () => {
    test('successfully adds a comment to the blog', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogIdToCommentOn = blogsAtStart[0].id
        const newComment = 'This is a test comment.'

        const response = await api
            .post(`/api/blogs/${blogIdToCommentOn}/comments`)
            .send({ comment: newComment })
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const updatedBlog = response.body
        assert.ok(updatedBlog.comments.includes(newComment))
    })

    test('comments array remains unchanged if no comment provided', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogIdToUpdate = blogsAtStart[0].id
        await api
            .post(`/api/blogs/${blogIdToUpdate}/comments`)
            .send({}) // no comments provided
            .expect(400)
    })

    test('adding comment to non-existing blog returns 400', async () => {
        const validButMissingId = await helper.nonExistingId()
        await api
            .post(`/api/blogs/${validButMissingId}/comments`)
            .send({ comment: 'This comment will not be added.' })
            .expect(400)
    })
})

describe('deleting a blog', () => {
    test('succeeds with valid id and correct user logged in', async () => {
        const initialBlogs = await helper.blogsInDb()
        const blogToDelete = initialBlogs[0]
        assert.ok(blogToDelete)
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${tokenForUserWithBlogs}`)
            .expect(204)
        
        const blogsAfterDelete = await helper.blogsInDb()
        assert.strictEqual(blogsAfterDelete.length, initialBlogs.length - 1)
        assert.ok(!blogsAfterDelete.includes(blogToDelete))
    })

    test('returns 404 with well-formed id that does not exist', async () => {
        const validButMissingId = await helper.nonExistingId()

        await api
            .delete(`/api/blogs/${validButMissingId}`)
            .set('Authorization', `Bearer ${tokenForUserWithBlogs}`)
            .expect(404)
    })

    test('returns 400 with malformatted id', async () => {
    const malformattedId = '12345'

    await api
        .delete(`/api/blogs/${malformattedId}`)
        .set('Authorization', `Bearer ${tokenForUserWithBlogs}`)
        .expect(400)
    })

    test('fails with 403 if user trying to delete the blog did not create it', async () => {
        // create a new user
        const newUser = {
            username: 'anotheruser',
            name: 'Another User',
            password: 'anotherpassword'
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
        const loginResponse = await api
            .post('/api/login')
            .send({ username: newUser.username, password: newUser.password })
            .expect(200)
        const anotherUserToken = loginResponse.body.token
        const initialBlogs = await helper.blogsInDb()
        const blogToDelete = initialBlogs[0]
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${anotherUserToken}`)
            .expect(403)
    })
})

describe('when there is initially one user in db', () => {

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        await api
            .post('/api/users')
            .send(helper.validUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(helper.validUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const result = await api
            .post('/api/users')
            .send({ username: helper.hashedInitialUsers[0].username, name: 'Another Name', password: 'AnotherPassword' })
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message is username is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const result = await api
            .post('/api/users')
            .send(helper.userWithShortUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('invalid user created: username must be at least 3 characters long'))
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('creation fails with proper statuscode and message is password is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const result = await api
            .post('/api/users')
            .send(helper.userWithShortPassword)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('invalid user created: password must be at least 3 characters long'))
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })
})

describe('logging in', () => {

    test('succeeds with correct credentials', async () => {
        const result = await api
            .post('/api/login')
            .send({ username: helper.plaintextInitialUsers[0].username, password: helper.plaintextInitialUsers[0].password })
            .expect(200)
            .expect('Content-Type', /application\/json/) 
        assert.ok(result.body.token)
    })

    test('fails with incorrect credentials', async () => {
        const result = await api
            .post('/api/login')
            .send({ username: helper.plaintextInitialUsers[0].username, password: 'wrongpassword' })
            .expect(401)
            .expect('Content-Type', /application\/json/) 
        assert.ok(result.body.error.includes('invalid username or password'))
    })
})

after(async () => {
    await mongoose.connection.close()
})