const { test, describe } = require('node:test')
const assert = require('node:assert')
const totalLikes = require('../utils/list_helper').totalLikes
const favoriteBlog = require('../utils/list_helper').favoriteBlog
const mostBlogs = require('../utils/list_helper').mostBlogs
const mostLikes = require('../utils/list_helper').mostLikes
/*
const blogs = [
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

describe('total likes', () => {
    test('of empty list is zero', () => {
        assert.strictEqual(totalLikes([]), 0)
    })

    test('of list of one blog is likes of that', () => {
        assert.strictEqual(totalLikes([blogs[0]]), 7)
    })

    test('of list is calculated right', () => {
        assert.strictEqual(totalLikes(blogs), 36)
    })
})

describe('favorite blog', () => {
  test('of empty list is null', () => {
      assert.strictEqual(favoriteBlog([]), null)
  })

  test('of list of one blog is that blog', () => {
      assert.deepStrictEqual(favoriteBlog([blogs[0]]), blogs[0])
  })

  test('of list is found right', () => {
      assert.deepStrictEqual(favoriteBlog(blogs), blogs[2])
  })
})

describe('most blogs', () => {
  test('of empty list is null', () => {
      assert.strictEqual(mostBlogs([]), null)
  })

  test('of list of one blog is that blog\'s author', () => {
      assert.strictEqual(mostBlogs([blogs[0]]), blogs[0].author)
  })

  test('of list is found right', () => {
      assert.strictEqual(mostBlogs(blogs), 'Robert C. Martin')
  })
})

describe('most likes', () => {
  test('of empty list is null', () => {
      assert.strictEqual(mostLikes([]), null)
  })

  test('of list of one blog is that blog\'s author', () => {
      assert.strictEqual(mostLikes([blogs[1]]), blogs[1].author)
  })

  test('of list is found right', () => {
      assert.strictEqual(mostLikes(blogs), 'Edsger W. Dijkstra')
  })
})
*/