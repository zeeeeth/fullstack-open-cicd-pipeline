import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import LoginInformation from './components/LoginInformation'
import LoginForm from './components/LoginForm'
import AddBlogForm from './components/AddBlogForm'
import BlogList from './components/BlogList'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  /* Load blogs on startup */
  useEffect(() => {
    const loadInitialBlogs = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      } catch (error) {
        notify(`Error fetching blogs: ${error.message}`, 'error')
        setIsError(true)
      }
      setIsLoading(false)
    }
    loadInitialBlogs()
  }, [])

  /* Check for logged in user on startup */
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type='info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      notify(`login as ${user.name} successful`, 'success')
      return true
    } catch {
      notify('wrong username or password', 'error')
      return false
    }
  }

  const addBlog = async (blogData) => {
    try {
      const createdBlog = await blogService.create(blogData)
      const createdWithUser = { ...createdBlog, user }

      setBlogs(prev => prev.concat(createdWithUser))
      notify(`a new blog "${createdBlog.title}" by ${createdBlog.author} added`, 'success')
      return createdWithUser
    } catch (error) {
      notify(`Error creating blog: ${error.message}`, 'error')
    }
  }

  const updateBlog = async (id, blogData) => {
    try {
      const response = await blogService.update(blogData)
      setBlogs(prev =>
        prev.map((blog) => blog.id === id ? { ...response, user : blog.user } : blog)
      )
    } catch (error) {
      notify(`Error liking blog: ${error.message}`, 'error')
    }
  }

  const removeBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(prev => prev.filter((blog) => blog.id !== id))
    } catch (error) {
      notify(`Error deleting blog: ${error.message}`, 'error')
    }
  }

  if (isError)
    return (<div>Error loading blogs</div>)
  if (isLoading)
    return (<div>Loading blogs...</div>)

  if (!user) {
    return (
      <div>
        <Notification notification={notification}/>
        <LoginForm handleLogin={handleLogin}/>
      </div>
    )
  } else {
    return (
      <div>
        <Notification notification={notification}/>
        <h2>blogs</h2>
        <LoginInformation user={user}/>
        <BlogList blogs={blogs} user={user} createBlog={addBlog} updateBlog={updateBlog} removeBlog={removeBlog}/>
      </div>
    )
  }
}

export default App