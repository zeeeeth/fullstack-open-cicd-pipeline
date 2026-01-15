import { useState } from 'react'

const Blog = ({ blog, user, updateBlog, removeBlog }) => {

  const [isExpanded, setIsExpanded] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded)
  }

  const incrementLikes = () => {
    const newBlog = { ...blog, likes: (blog.likes || 0) + 1 }
    updateBlog(blog.id, newBlog)
  }

  const details = () => {
    return (
      <div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button type="button" onClick={incrementLikes}>like</button>
        </div>
        <div>{blog.user && blog.user.name}</div>
      </div>
    )
  }

  return (
    <div data-testid="blog" style={blogStyle}>
      <div>
        <span>{blog.title}</span> 
        <span>{blog.author}</span>
        <button onClick={toggleExpansion}>
          {isExpanded ? 'hide' : 'view'}
        </button>
      </div>
      {isExpanded && details()}
      <div style={{ display: blog.user && blog.user.username === user.username ? '' : 'none' }}>
        <button type="button" onClick={() => removeBlog(blog.id)}>remove</button>
      </div>
    </div>
  )
}

export default Blog