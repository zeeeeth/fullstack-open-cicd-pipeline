const dummy = (blogs) => {
  return 1
}

const totalLikes = blogs => {

    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)
}

const favoriteBlog = blogs => {

    const reducer = (favorite, item) => {
        return favorite.likes >= item.likes ? favorite : item
    }

    return blogs.length === 0
        ? null
        : blogs.reduce(reducer)
}

const mostBlogs = blogs => {

    const authorBlogCount = {}

    blogs.forEach(blog => {
        if (authorBlogCount[blog.author])
            authorBlogCount[blog.author] += 1
        else 
            authorBlogCount[blog.author] = 1    
    })

    let maxBlogs = 0
    let mostBlogsAuthor = null

    for (const author in authorBlogCount) {
        if (authorBlogCount[author] > maxBlogs) {
            maxBlogs = authorBlogCount[author]
            mostBlogsAuthor = author
        }
    }

    return mostBlogsAuthor
}

const mostLikes = blogs => {

    const authorLikeCount = {}

    blogs.forEach(blog => {
        if (authorLikeCount[blog.author])
            authorLikeCount[blog.author] += blog.likes
        else
            authorLikeCount[blog.author] = blog.likes
    })

    maxLikes = 0
    mostLikesAuthor = null
    for (const author in authorLikeCount) {
        if (authorLikeCount[author] > maxLikes) {
            maxLikes = authorLikeCount[author]
            mostLikesAuthor = author
        }
    }

    return mostLikesAuthor
}

module.exports = {
  dummy,
  totalLikes, 
  favoriteBlog,
  mostBlogs,
  mostLikes
}