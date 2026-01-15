const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const validBlog = {
    title: "yet another test blog",
    author: "me once again",
    url: "urllll",
    likes: 2,
    comments: ["Great blog!", "Very informative."]
}

const blogWithoutLikes = {
    title: "yet another test blog",
    author: "me once again",
    url: "urllll"
}

const blogWithoutTitle = {
    author: "me once again",
    url: "urllll",
    likes: 2
}

const blogWithoutUrl = {
    title: "yet another test blog",
    author: "me once again",
    likes: 2
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
    const blog = new Blog({ title: 'x', url: 'y', author: 'z' })
    await blog.save()
    await blog.deleteOne()
    return blog.id
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const validUser = {
  username: 'myUsername',
  name: 'myName',
  password: 'myPassword'
}

const userWithTakenUsername = {
  username: 'root',
  name: 'newName',
  password: 'newPassword'
}

const userWithShortUsername = {
    username: 'ro',
    name: 'waytooshort',
    password: 'validpassword'
}

const userWithShortPassword = {
    username: 'roooot',
    name: 'waytooshortagain',
    password: 'pw'
}

const plaintextInitialUsers = [
  {
    username: 'Real_Batman123',
    name: 'Bruce Wayne',
    password: 'robinisthebest'
  },
  {
    username: 'JohnDoe85',
    name: 'John Doe',
    password: 'letmein123'
  },
  {
    username: 'BobBarker78',
    name: 'Bob Barker',
    password: 'thepriceisright'
  }
]

const hashedInitialUsers = plaintextInitialUsers.map((user) => {
  const passwordHash = bcrypt.hashSync(user.password, 10)
  return {
    username: user.username,
    name: user.name,
    passwordHash
  }
})

module.exports = {
    initialBlogs,
    validBlog,
    blogWithoutLikes,
    blogWithoutTitle,
    blogWithoutUrl,
    blogsInDb,
    nonExistingId,
    usersInDb,
    validUser,
    userWithTakenUsername,
    userWithShortUsername,
    userWithShortPassword,
    plaintextInitialUsers,
    hashedInitialUsers
}