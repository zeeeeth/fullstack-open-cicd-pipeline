import Blog from './Blog'
import Togglable from './Togglable'
import AddBlogForm from './AddBlogForm'


const BlogList = ({ blogs, user, createBlog, updateBlog, removeBlog }) => {
  return (
    <div>
      <Togglable buttonLabel="create new blog">
        <AddBlogForm createBlog={createBlog}/>
      </Togglable>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
        />
      )}
    </div>
  )
}

export default BlogList